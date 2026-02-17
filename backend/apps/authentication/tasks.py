from celery import shared_task
from .choices import CodeStatus
from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import send_mail
from apps.investment_plans.models import UserInvestment
import requests


@shared_task
def expire_reset_code(user_code):
    from .models import UserCode
    code = UserCode.objects.get(code=user_code)
    if code.status == CodeStatus.UNUSED:
        code.status = CodeStatus.INVALID
        code.is_active = False
        code.save()
        return "Expired code "+ str(user_code)
    return "No expired code " + str(user_code)

@shared_task
def send_webbhook_registration(user_id):
    from .models import User
    user = User.objects.get(pk=user_id)
    if user.is_active:
        user_investment = UserInvestment.objects.filter(user=user).exclude(min_time_to_withdraw=None)
        is_active = user_investment.exists()
        if user_investment:
            is_active = user_investment.last().total_investment_amount > 0
            
        response1 = requests.post("https://services.leadconnectorhq.com/hooks/bTGMHumUtgna9Bn3F3a2/webhook-trigger/b3d75ef8-121f-4b7e-8406-38a0df23e6e7",
                            json={
                                "first_name": user.first_name,
                                "last_name": user.last_name,
                                "username": user.username,
                                "email":user.email,
                                "phone_number": user.phone_number,
                                "is_active": is_active
                            },)
        response2 = {"text": ""}
        if is_active:
            response2 = requests.post("https://services.leadconnectorhq.com/hooks/bTGMHumUtgna9Bn3F3a2/webhook-trigger/e88cd5ae-8577-4361-983f-b8cbad22d6a4",
                            json={
                                "first_name": user.first_name,
                                "last_name": user.last_name,
                                "username": user.username,
                                "email":user.email,
                                "phone_number": user.phone_number,
                                "is_active": is_active
                            },)
        else:
            response2 = requests.post("https://services.leadconnectorhq.com/hooks/bTGMHumUtgna9Bn3F3a2/webhook-trigger/94719d2e-b011-4e31-b1d9-1caf988f6ae5",
                            json={
                                "first_name": user.first_name,
                                "last_name": user.last_name,
                                "username": user.username,
                                "email":user.email,
                                "phone_number": user.phone_number,
                                "is_active": is_active
                            },)
            
        return f"{response1.text} - {response2.text}"
    else:
        return "Usuario aún no esta verificado"
    
@shared_task(name="send_verification_email_task")
def send_verification_email_task(user_id):
    """
    Tarea de Celery para enviar un correo de verificación de forma asíncrona.
    """
    try:
        from .models import User, EmailVerification
        user = User.objects.get(pk=user_id)
        # Asegúrate de que el usuario tiene un perfil de verificación
        verification = EmailVerification.objects.get(user=user)
        
        # --- Variables para el correo ---
        
        # 1. URL del Frontend para la verificación
        # (Asegúrate de tener esta variable en tu settings.py)
        # Ejemplo: FRONTEND_URL = "http://localhost:3000"
        verification_url = f"https://{settings.FRONTEND_DOMAIN}/auth/verify-email/{verification.code}/"

        # 2. Asunto del correo
        subject = "¡Bienvenido! Confirma tu correo electrónico"
        
        # 3. Contexto para la plantilla HTML
        context = {
            'user_name': user.first_name or user.username,
            'verification_url': verification_url,
            'button_text': "Verificar mi Cuenta",
        }

        # Renderizar la plantilla HTML a un string
        html_message = render_to_string('authentication/verify_account.html', context)
        
        # El correo se enviará como HTML, por lo que el mensaje de texto plano puede ser simple.
        plain_message = f"Hola {context['user_name']},\n\nVisita el siguiente enlace para verificar tu cuenta: {verification_url}\n\nEl equipo de Smart Solution."

        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL, # Configurado en settings.py
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return f"Correo de verificación enviado a {user.email}"
    except User.DoesNotExist:
        return f"Error: Usuario con ID {user_id} no existe."
    except EmailVerification.DoesNotExist:
        return f"Error: No se encontró registro de verificación para el usuario con ID {user_id}."
    except Exception as e:
        # Puedes añadir un logging más robusto aquí
        return f"Error al enviar el correo: {e}"



@shared_task
def send_secret_update_profile_code(secret_code_id, subject="Código de Actualización de perfil!", message="'Usa el siguiente código para confirmar tu solicitud de retiro o actualización  de perfil:'"):
    from .models import UserCode
    secret_code = UserCode.objects.get(pk=secret_code_id)
    
    # 2. Asunto del correo
    
    
    # 3. Contexto para la plantilla HTML
    context = {
        'user_name': secret_code.user.first_name or secret_code.user.username,
        'code':secret_code.code,
        'message': message
    }

    # Renderizar la plantilla HTML a un string
    html_message = render_to_string('withdrawals/secret_code.html', context)
    
    
    if not message:
    # El correo se enviará como HTML, por lo que el mensaje de texto plano puede ser simple.
        plain_message = f"Hola {context['user_name']},\nCódigo secreto para actualización de perfil!"
    else:
        plain_message = message

    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL, # Configurado en settings.py
        recipient_list=[secret_code.user.email],
        html_message=html_message,
        fail_silently=False,
    )