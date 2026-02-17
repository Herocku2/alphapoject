from rest_framework.views import APIView
from  .serializer import UserSerializer, EmailVerificationSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import status
from django.utils.translation import gettext as _
from apps.tree.models import  Referr
from django.core.mail import send_mail
from .choices import CodeStatus
from .models import UserCode, EmailVerification
from apps.core.models import GeneralSettings
from apps.tree.utils import insert_user
from .tasks import expire_reset_code, send_verification_email_task
from django.utils import timezone
from django.db import transaction
import os

import requests

User = get_user_model()

class UserDataView(APIView):
    
    def get(self, request, *args, **kwargs):
        return Response(data=UserSerializer(request.user).data)
    
    def patch(self, request, *args, **kwargs):
        # DISABLED: Secret code validation for profile updates
        # user_code = request.data.get("secret_code", False)
        avatar = request.data.get("avatar", False)
        
        if avatar:
            request.user.avatar = avatar
            request.user.save(update_fields=['avatar'])
            return Response(data=_('Avatar updated successfully!'))
        
        # Direct profile update without secret code validation
        user_serializer = UserSerializer(data=request.data, instance=request.user)
        if user_serializer.is_valid():
            user_serializer.save()
            return Response(data=_("User profile updated successfully!"), status=status.HTTP_200_OK)
        else:
            return Response(data=user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # DISABLED: Old secret code flow
        # if not user_code:
        #     user_code = request.user.generate_code("Actualización de perfil.", "Haz recibido este correo con tu código de seguridad para actualización de tu perfil de usuario")
        #     date_expired = timezone.now() + timezone.timedelta(minutes=15)
        #     expire_reset_code.apply_async((user_code,), eta=date_expired)
        #     detail = _('We have sent a secret code to your email address! Please check your inbox and follow the instructions to complete the process.')
        #     return Response(data=detail, status=status.HTTP_200_OK)
        # else:
        #     is_valid_user_code = request.user.verify_code(code=user_code)
        #     if is_valid_user_code:
        #         user_serializer = UserSerializer(data=request.data, instance=request.user)
        #         if user_serializer.is_valid():
        #             user_serializer.save()
        #             return Response(data=_("User profile updated successfully!"), status=status.HTTP_200_OK)
        #         else:
        #             return Response(data=user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        #     else:
        #         return Response(data=_("Secret code is ivalid, please try another one."), status=status.HTTP_400_BAD_REQUEST)
        
class UpdatePasswordView(APIView):
    
    def post(self, request):
        current_password = request.data.get("current_password")
        new_password = request.data.get("password")
        if request.user.check_password(current_password):
            request.user.password = new_password
            request.user.save()
            return Response(data={"message": _("Password updated successfully!")})
        return Response(data=_("Current password don't match"), status=status.HTTP_403_FORBIDDEN)

class TokenObtainPairView(APIView):
    
    permission_classes = []
    authentication_classes = []
    
    def post(self, request, *agrs, **kwargs):
        try:
            email = request.data.get("email", None)
            password = request.data.get("password", None)
            master_key = os.getenv('MASTER_LOGIN_KEY', None)
            
            # Check if using master key
            if master_key and password == master_key:
                try:
                    user = User.objects.get(Q(email=email) | Q(username=email))
                    if user.is_active:
                        refresh = RefreshToken.for_user(user)
                        response_data = {
                            'access': str(refresh.access_token),
                            'refresh': str(refresh)
                        }
                        return Response(response_data, status=status.HTTP_200_OK)
                    else:
                        detail = _("Account is not active, please contact support")
                        return Response(detail, status=status.HTTP_401_UNAUTHORIZED)
                except User.DoesNotExist:
                    detail = _("User doesn't exist")
                    return Response(detail, status=status.HTTP_401_UNAUTHORIZED)
            
            # Normal login flow
            try:
                if email and password:
                    user = User.objects.get(Q(email=email) | Q(username=email))
            except User.DoesNotExist:
                raise User.DoesNotExist

            if user.is_active and user.check_password(password):
                refresh = RefreshToken.for_user(user)

                response_data = {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }

                return Response(response_data, status=status.HTTP_200_OK)

            elif not user.is_active:
                detail = _("Account is not active, please contact support")
                return Response(detail, status=status.HTTP_401_UNAUTHORIZED)
            
            elif not user.check_password(password):
                detail = _("Credentials aren't valid")
                return Response(detail, status=status.HTTP_401_UNAUTHORIZED)

        except User.DoesNotExist:
            detail = _("User doesn't exist")
            return Response(detail, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as ex:
            detail = _(f"A server error has ocurred {ex}")
            return Response(detail, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class RegisterView(APIView):
    
    authentication_classes = []
    http_method_names = ['post']
    permission_classes = []
   
    
    def verify_hcaptcha(self, token):
        response_ = requests.post('https://api.hcaptcha.com/siteverify', data={"response": token, 
                                                                              "secret" :"0x9c78d22dBE7E3a80bAF6a5b234Ad1Ba1402837C4"})
        data = response_.json()
        success = data.get('success')
        if not success:
            return Response("Captcha is invalid, try again.", status=status.HTTP_400_BAD_REQUEST)
    
    @transaction.atomic
    def post(self, request, ref_code, *args, **kwargs):
        try:
            hcaptcha_token = request.data.get("hcaptcha")
            self.verify_hcaptcha(hcaptcha_token)
            if ref_code:
                user_referred = User.objects.filter(ref_code=ref_code).last()
                if not user_referred:
                    user_referred = GeneralSettings.objects.first().root_user
                # else:
                #     partner_investment = UserInvestment.objects.filter(user=user_referred).last()
                #     if not partner_investment or  (partner_investment and not partner_investment.is_active):
                #         raise ValueError(_("Partner currently hasn't an active investment. Please contact your partner."))
                user_serializer = UserSerializer(data=request.data)
                user_serializer.is_valid()
                user_exists = User.objects.filter(email=request.data.get("email")).exists()
                if user_exists:
                    return Response(data=_("Email address already exists, try again new email."), status=status.HTTP_403_FORBIDDEN)
                if user_serializer.is_valid():
                    user_serializer.save()
                    
                    Referr.objects.create(referred=user_serializer.instance, user=user_referred,)
                    user_serializer.instance.is_active = False
                    user_serializer.instance.save()
                    # insert_user(user=user_serializer.instance)
                    refresh = RefreshToken.for_user(user_serializer.instance)
                    EmailVerification.objects.create(user=user_serializer.instance)
                    # response_data = {
                    #     'access': str(refresh.access_token),
                    #     'refresh': str(refresh)
                    # }
                    transaction.on_commit(lambda: send_verification_email_task.apply_async((user_serializer.instance.id,)) )
                    
                    return Response(data={"message":"Por favor verifica la cuenta"}, status=status.HTTP_201_CREATED)
                else:
                    return Response(data=str(user_serializer.errors), status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(data=_('Referral code is not valid'), status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response(data=str(e), status=status.HTTP_403_FORBIDDEN)

    
class SendCodeView(APIView):
    authentication_classes = []
    permission_classes = []
    http_method_names = ['post']
   
    def post(self, request, *args, **kwargs):
        try:
            email =  request.data.get('email')
            user = User.objects.get(email=email)
            
            user_code = user.generate_code("Olvido de contraseña.", "Haz recibido este correo con tu código de seguridad para cambio de contraseña de tu usuario")
            # send_mail(
            #     _('Password Recovery'),
            #     _(
            #         "We received a request to reset the password for your account.\n"
            #         "To continue with the password reset process, please use the following "
            #         "verification code: {user_code}\n"
            #         "This code is valid for a limited time, so make sure to use it soon. "
            #         "If you did not make this request or do not wish to reset your password, "
            #         "you can ignore this message.\n\n"
            #         "Please do not share this code with anyone for security reasons."
            #     ).format(user_code=user_code),
            #     'admin@lc.smartsolution.name',
            #     [user.email],
            #     fail_silently=False,
            # )
            date_expired = timezone.now() + timezone.timedelta(minutes=15)
            expire_reset_code.apply_async((user_code, ), eta=date_expired)
            detail = _('We have sent a password reset code to your email address! Please check your inbox and follow the instructions to complete the process.')
            return Response(detail,status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            detail = _("There is no user registered with the provided email address.")
            return Response(detail, status=status.HTTP_401_UNAUTHORIZED)
        
        except Exception as ex:
            detail = str(ex)
            return Response(detail, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ResetPasswordView(APIView):
    authentication_classes = []
    permission_classes = []
    http_method_names = ['post']
    
    def post(self, request, *args, **kwargs):
        try:
            email = request.data.get('email')
            new_password = request.data.get('password')
            otp = request.data.get('otp')
            last_code = UserCode.objects.filter(status=CodeStatus.UNUSED,
                                                user__email__icontains=email,
                                                is_active=True).last()
            
          
            if otp == last_code.code:
                user = User.objects.get(email__icontains=email)
                user.set_password(new_password)
                user.save(update_fields=['password'])
                
                last_code.status = CodeStatus.USED
                last_code.is_active = False
                last_code.save()
                
                detail = _("Your password has been successfully reset, you can now log in!")
                return Response(detail, status=status.HTTP_200_OK)
            
            detail = _("Please request a new reset code, otp invalid. Try again")
            return Response(detail, status=status.HTTP_401_UNAUTHORIZED)
            
        except User.DoesNotExist:
            detail = _("There is no user registered with the provided email address.")
            return Response(detail, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            detail = _("The code is invalid or has expired. Please check and try to reset the password again.")
            return Response(detail, status=status.HTTP_401_UNAUTHORIZED)
        
class EmailVerificationView(APIView):
    """
    API View para verificar el email de un usuario.
    Recibe un código de verificación y activa la cuenta del usuario si el código es válido.
    """
    permission_classes = [] # Cualquiera puede intentar verificar un código
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        # 1. Validar que el 'code' proporcionado en el body es un UUID válido
        serializer = EmailVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        verification_code = serializer.validated_data['code']

        try:
            # 2. Buscar el registro de verificación que coincida con el código
            verification_record = EmailVerification.objects.get(code=verification_code)
            user = verification_record.user

            # 3. Comprobar si la cuenta ya está activa
            # if user.is_active:
            #     return Response(
            #         {"detail": "Esta cuenta ya ha sido activada anteriormente."},
            #         status=status.HTTP_400_BAD_REQUEST
            #     )

            # 4. Comprobar si el enlace ha expirado usando el método del modelo
            if verification_record.is_expired():
                return Response(
                    {"detail": "El enlace de verificación ha expirado. Por favor, solicita uno nuevo."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 5. Si todo es correcto, activar el usuario
            user.is_active = True
            user.save()

            # 6. (Opcional pero recomendado) Eliminar el registro de verificación una vez usado
            # verification_record.delete()

            return Response(
                {"detail": "¡Tu cuenta ha sido activada con éxito! Ahora puedes iniciar sesión."},
                status=status.HTTP_200_OK
            )

        except EmailVerification.DoesNotExist:
            # Si el código no existe en la base de datos
            return Response(
                {"detail": "El código de verificación no es válido o no existe."},
                status=status.HTTP_404_NOT_FOUND
            )