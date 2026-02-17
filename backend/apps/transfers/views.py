from rest_framework import views, response, status, serializers
from django.db import transaction

from decimal import Decimal
from django.utils import timezone
from django.db.models import Q

from apps.authentication.models import User
from apps.investment_plans.models import UserInvestment, InvestmentPlanTransaction, TransactionStatus
from .models import UserTransfer
from rest_framework import  permissions, viewsets
from .serializers import FoundUserSerializer, UserTransferSerializer
from django.utils.translation import gettext as _
from apps.withdrawals.models import SecretCode, CodeStatuses
from apps.core.paginators import BasicPaginationResponse

# Serializador para validar la entrada
class CreateTransferSerializer(serializers.Serializer):
    receiver_username = serializers.CharField()
    amount = serializers.DecimalField(max_digits=20, decimal_places=2)
    transfer_type = serializers.ChoiceField(choices=UserTransfer.TransferType.choices)
    secret_code = serializers.CharField()


class FindUserView(views.APIView):
    """
    Vista para encontrar un usuario por su email a través de una petición POST.
    Espera un cuerpo JSON como: { "email": "test@example.com" }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email', None)

        if not email:
            return response.Response(
                {"detail": "El campo 'email' es requerido."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Usamos get() para obtener un solo usuario. Si no existe, lanza DoesNotExist.
            # Usamos 'iexact' para que la búsqueda no distinga mayúsculas/minúsculas.
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return response.Response(
                {"detail": "Usuario no encontrado."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Si se encuentra el usuario, lo serializamos y devolvemos
        serializer = FoundUserSerializer(user)
        return response.Response(serializer.data, status=status.HTTP_200_OK)

class CreateUserTransferView(views.APIView):
    
    @transaction.atomic()
    def post(self, request, *args, **kwargs):
        serializer = CreateTransferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        sender = request.user
        amount = data['amount']
        transfer_type = data['transfer_type']
        try:
            used_code_obj = SecretCode.objects.get(code=data['secret_code'], user=sender,
                                                status=CodeStatuses.UNUSED)
            used_code_obj.status = CodeStatuses.USED
            used_code_obj.save()
            
        except SecretCode.DoesNotExist:
            raise serializers.ValidationError(_("Invalid or expired secret code."))

        # 2. Validar receptor
        try:
            receiver = User.objects.get(username=data['receiver_username'])
        except User.DoesNotExist:
            raise serializers.ValidationError(_("Receiver user not found."))

        if amount <= 0:
            raise serializers.ValidationError(_("You cannot send money negative amount."))

        if sender == receiver:
            raise serializers.ValidationError(_("You cannot send money to yourself."))

        # 3. Lógica de transferencia según el tipo
        if transfer_type == UserTransfer.TransferType.BALANCE:
            if sender.balance < amount:
                raise serializers.ValidationError(_("Insufficient referral balance."))
            sender.balance -= amount
            receiver.balance += amount

        elif transfer_type == UserTransfer.TransferType.UTILITY:
            if sender.investment_balance < amount:
                raise serializers.ValidationError(_("Insufficient utility balance."))
            sender.investment_balance -= amount
            receiver.investment_balance += amount

        elif transfer_type == UserTransfer.TransferType.INVESTMENT:
            sender_investment = UserInvestment.objects.select_for_update().filter(user=sender, status=True).first()
            if not sender_investment:
                raise serializers.ValidationError(_("You don't have an active investment."))

            withdrawable_amount = sender_investment.withdrawable_deposit_amount
            if withdrawable_amount < amount:
                raise serializers.ValidationError(_(f"Your withdrawable investment balance (${withdrawable_amount}) is not enough."))

            # --- INICIO DE LA LÓGICA CORREGIDA ---
            # Esta es la implementación de la lógica que proporcionaste.
            
            remaining_to_withdraw = amount

            # Obtenemos los depósitos elegibles, del más antiguo al más nuevo con lock
            eligible_deposits = sender_investment.investments.select_for_update().filter(
                status=TransactionStatus.APPROVED,
                is_free=False,
                available_for_withdrawal_date__lte=timezone.now()
            ).order_by('date')

            for deposit in eligible_deposits:
                if remaining_to_withdraw <= 0:
                    break  # Se ha cubierto todo el monto a retirar

                # Calculamos cuánto se puede retirar de este depósito específico
                available_in_this_deposit = deposit.amount - deposit.withdrawn_from_deposit
                
                # Determinamos cuánto retirar realmente de este depósito
                amount_to_pull = min(remaining_to_withdraw, available_in_this_deposit)

                # Actualizamos los montos
                deposit.withdrawn_from_deposit += amount_to_pull
                # sender_investment.withdrawn += amount_to_pull
                remaining_to_withdraw -= amount_to_pull
                
                deposit.save() # Guardamos el cambio en la transacción de depósito individual

            # Si después del bucle aún queda monto por retirar, algo salió mal (debería ser 0)
            if remaining_to_withdraw > 0:
                 # Esto revierte la transacción gracias al transaction.atomic()
                raise serializers.ValidationError(_("An inconsistency was found in the withdrawable balances. The operation has been canceled."))

            sender_investment.save() # Guardamos el cambio total en la inversión del usuario
            
            receiver_investment, sta = UserInvestment.objects.get_or_create(user=receiver, status=True)
            InvestmentPlanTransaction.objects.create(
                amount=amount,
                status=TransactionStatus.APPROVED,
                current_investment=receiver_investment,
            )

        # 4. Guardar cambios y registrar la transacción
        sender.save()
        receiver.save()
        UserTransfer.objects.create(
            sender=sender,
            receiver=receiver,
            amount=amount,
            transfer_type=transfer_type
        )

        return response.Response({"detail": _("Transfer successful!")}, status=status.HTTP_200_OK)
    
    
class UserTransferHistoryView(viewsets.ReadOnlyModelViewSet):
    """
    Devuelve una lista paginada de las transferencias enviadas y recibidas
    por el usuario autenticado.
    """
    serializer_class = UserTransferSerializer
    pagination_class = BasicPaginationResponse
    # La paginación se puede configurar globalmente en settings.py

    def get_queryset(self):
        """
        Filtra las transferencias para que solo muestre aquellas donde el
        usuario actual es el emisor O el receptor.
        """
        user = self.request.user
        # Usamos Q objects para la condición OR
        return UserTransfer.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-timestamp')