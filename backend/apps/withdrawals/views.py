from rest_framework.viewsets import ModelViewSet
from .serializers import WithdrawalSerializer
from .models import Withdrawal, SecretCode, WithdrawalMethod
from apps.core.paginators import BasicPaginationResponse
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.translation import gettext as _
from rest_framework import status
from django.core.mail import send_mail
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAdminUser 
from apps.investment_plans.choices import TransactionStatus
from django.utils import timezone

class WithdrawalViewset(ModelViewSet):
    
    serializer_class = WithdrawalSerializer
    pagination_class = BasicPaginationResponse
    
    
    def get_queryset(self):
        return Withdrawal.objects.filter(user=self.request.user)
    
    @transaction.atomic()
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            transaction.set_rollback(True)
            return Response(data=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context
    
    @action(url_path="create-code", methods=['POST'], detail=False)
    @transaction.atomic()
    def create_code(self, request, *args, **kwargs):
        try:
            secret_code_obj = SecretCode.objects.create(user=request.user)

#             subject = _('Your Secret Code for Withdrawal')
#             message = _('''Congrats,

# Your secret code is: {secret_code}

# Thanks for using our service'''
#                     ).format(secret_code=secret_code_obj.code)
#             send_mail(subject, message, 'admin@lc.smartsolution.name', [request.user.email])
            return Response(data=_("Code sent successfully"))
        except Exception as e:
            transaction.set_rollback(True)
            return Response(data=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
    @action(url_path="admin-withdrawals", detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def all_withdrawals(self, request):
        """
        Action to retrieve all withdrawal records, with optional status filtering.
        Only accessible by superusers.
        Expected query parameters:
        - status: (optional) Filter withdrawals by their status (e.g., '1' for PENDING, '2' for APPROVED).
        - method: (optional) Filter by withdrawal method (crypto/fiat)
        - username: (optional) Search by username
        """
        queryset = Withdrawal.objects.select_related('user').all().order_by('-date')

        # Get query parameters
        status_param = request.query_params.get('status', None)
        method_param = request.query_params.get('method', None)
        username_param = request.query_params.get('username', None)
        
        # Apply filtering if parameters are provided
        if status_param:
            queryset = queryset.filter(status=status_param)

        if method_param:
            queryset = queryset.filter(method=method_param)
            
        if username_param:
            queryset = queryset.filter(user__username__icontains=username_param)
            
        # Paginate the filtered queryset
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # Fallback if pagination is skipped (unlikely with pagination_class set)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    @action(url_path="pay-admin-withdrawals", detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def pay_withdrawals(self, request):
        """
        Action to mark multiple withdrawals as paid.
        Only accessible by admin users.
        
        Expects a POST request with the following JSON body:
        {
            "withdrawalIds": [1, 2, 3],
            "hash": "0x123abc..."
        }
        """
        # 1. Obtener y validar los datos de entrada
        data = request.data
        withdrawal_ids = data.get('withdrawalIds')
        tx_hash = data.get('hash')

        if not withdrawal_ids or not isinstance(withdrawal_ids, list):
            return Response(
                {"detail": "El campo 'withdrawalIds' es requerido y debe ser una lista."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not tx_hash or not isinstance(tx_hash, str):
            return Response(
                {"detail": "El campo 'hash' es requerido y debe ser un string."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # 2. Usar una transacción atómica para garantizar la integridad de los datos
            with transaction.atomic():
                # Filtrar los retiros que se van a actualizar
                withdrawals_to_update = Withdrawal.objects.filter(id__in=withdrawal_ids)

                # 3. Actualizar los registros en una sola consulta a la base de datos
                updated_count = withdrawals_to_update.update(
                    status=TransactionStatus.APPROVED,  # O el estado que uses para 'Pagado'
                    payed_date=timezone.now(),
                    payment_link=tx_hash  # Guardamos el hash en el campo payment_link
                )
                
                # 4. Verificación: Si el número de retiros actualizados no coincide con los IDs enviados,
                # significa que algunos IDs no eran válidos. Lanzamos un error para revertir la transacción.
                if updated_count != len(withdrawal_ids):
                    raise ValueError("Algunos IDs de retiro no fueron encontrados. La operación ha sido cancelada.")

        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Captura cualquier otro error inesperado durante la transacción
            return Response(
                {"detail": f"Ocurrió un error inesperado: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 5. Devolver una respuesta exitosa
        return Response(
            {"detail": f"{updated_count} retiros han sido marcados como pagados con el hash: {tx_hash[:15]}..."},
            status=status.HTTP_200_OK
        )
        
    @action(url_path="refuse-withdrawals", detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def refuse_withdrawals(self, request):
        """
        Action to mark multiple withdrawals as paid.
        Only accessible by admin users.
        
        Expects a POST request with the following JSON body:
        {
            "withdrawalIds": [1, 2, 3],
            "hash": "0x123abc..."
        }
        """
        # 1. Obtener y validar los datos de entrada
        data = request.data
        withdrawal_ids = data.get('withdrawalIds')
        msg = data.get('msg')
        if not withdrawal_ids or not isinstance(withdrawal_ids, list):
            return Response(
                {"detail": "El campo 'withdrawalIds' es requerido y debe ser una lista."},
                status=status.HTTP_400_BAD_REQUEST
            )
        updated_count=0
        try:
            # 2. Usar una transacción atómica para garantizar la integridad de los datos
            with transaction.atomic():
                # Filtrar los retiros que se van a actualizar
                withdrawals_to_update = Withdrawal.objects.filter(id__in=withdrawal_ids)
                
                for w in withdrawals_to_update:
                    w.status = TransactionStatus.REFUSED
                    w.refuse_message = msg
                    w.save()
                    updated_count += 1

                # # 3. Actualizar los registros en una sola consulta a la base de datos
                # updated_count = withdrawals_to_update.update(
                #     status=TransactionStatus.REFUSED,  # O el estado que uses para 'Pagado'
                #     refuse_message=msg  # Guardamos el hash en el campo payment_link
                # )
                
               
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Captura cualquier otro error inesperado durante la transacción
            return Response(
                {"detail": f"Ocurrió un error inesperado: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 5. Devolver una respuesta exitosa
        return Response(
            {"detail": f"{updated_count} retiros han sido marcados como rechazados con el mensaje: {msg}"},
            status=status.HTTP_200_OK
        )
        
    
    @action(detail=False, methods=['post'], url_path='pay-admin-withdrawals-fiat', permission_classes=[IsAdminUser])
    def process_fiat_withdrawal(self, request):
        """
        Action to mark a single FIAT withdrawal as paid and upload its payment proof.
        Expects a POST request with 'multipart/form-data'.
        
        - withdrawal_id: The ID of the single withdrawal to process.
        - payment_proof_file: The proof file (image, PDF, etc.).
        """
        # 1. Obtener y validar los datos de entrada
        withdrawal_id = request.data.get('withdrawal_id')
        payment_proof_file = request.FILES.get('payment_proof_file')

        if not withdrawal_id:
            return Response({"detail": "El campo 'withdrawal_id' es requerido."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not payment_proof_file:
            return Response({"detail": "El archivo 'payment_proof_file' es requerido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 2. Usar una transacción atómica
            with transaction.atomic():
                # 3. Obtener el retiro específico. Si no existe, falla.
                withdrawal = Withdrawal.objects.get(pk=withdrawal_id)

                # 4. Validaciones de negocio
                if withdrawal.status != TransactionStatus.PENDING:
                    raise ValueError("Este retiro ya ha sido procesado.")
                
                if withdrawal.method != WithdrawalMethod.FIAT:
                    raise ValueError("Este endpoint solo procesa retiros FIAT.")

                # 5. Actualizar el registro
                withdrawal.status = TransactionStatus.APPROVED
                withdrawal.payed_date = timezone.now()
                withdrawal.payment_invoice = payment_proof_file # Guardamos el archivo
                withdrawal.save()

        except Withdrawal.DoesNotExist:
            return Response({"detail": "El ID de retiro no fue encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"Ocurrió un error inesperado: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 6. Devolver una respuesta exitosa
        return Response(
            {"detail": f"El retiro #{withdrawal_id} ha sido marcado como pagado exitosamente."},
            status=status.HTTP_200_OK
        )