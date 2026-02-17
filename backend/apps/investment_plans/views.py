from rest_framework import response, status, views
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import InvestmentPlanTransaction, UserInvestment
from .choices import TransactionStatus
from .utils import create_payment_request, verify_payment_request
from django.utils.translation import gettext_lazy as _
from django.db import transaction
from apps.core.models import GeneralSettings
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from decimal import Decimal
from .serializers import InvestmentTransactionSerializer
from apps.core.paginators import BasicPaginationResponse
from .tasks import expire_payment
from django.utils import timezone
from apps.withdrawals.models import Withdrawal
from dateutil.relativedelta import relativedelta # <-- 1. Importar relativedelta


class InvestmentView(views.APIView):

    @transaction.atomic()
    def post(self, request, *args, **kwargs):
        try:
            user_investment = UserInvestment.objects.filter(user=request.user, status=True).last()
            if not user_investment:
                user_investment = UserInvestment.objects.create(user=request.user, status=True)
            amount = Decimal(request.data.get("amount", 0))
            pay_with_pasive = False
            if pay_with_pasive:
                if int(amount) <= int(request.user.balance):
                    new_transaction = InvestmentPlanTransaction.objects.create(amount=amount, status=TransactionStatus.APPROVED,
                                                                            current_investment=user_investment,
                                                                            pay_with_balance=True)
                    request.user.balance -= int(amount)
                    request.user.save(update_fields=['balance'])
                    return response.Response(data={"message": _("Payment with balance has been made successfully!")}, status=status.HTTP_200_OK)
                else:
                    return response.Response(data={"message": _("You don't have enough balance, try again.")}, status=status.HTTP_400_BAD_REQUEST)
           
            g_settings = GeneralSettings.objects.first()
            if g_settings.disable_deposits and not pay_with_pasive:
                return response.Response(data=g_settings.disable_deposits_message, status=status.HTTP_400_BAD_REQUEST)
            currency = "USDT.BEP20"
            if g_settings:
                currency = g_settings.currency_coin_payments
                
            if amount < g_settings.minimum_investment_amount:
                return response.Response(data=_("Investment amount must be at least ${} USDT, please try again.").format(g_settings.minimum_investment_amount),
                                                status=status.HTTP_400_BAD_REQUEST)
            
            pending_payment = user_investment.investments.filter(amount=amount, 
                                                                 status=TransactionStatus.PENDING,
                                                                 coinpayments_response__token=currency).last()

            if not pending_payment:
                
                if user_investment.total_investment_amount < g_settings.minimum_investment_amount:
                    if g_settings.minimum_investment_amount > float(amount):
                        return response.Response(data=_("Investment amount must be at least ${} USDT, please try again.").format(g_settings.minimum_investment_amount),
                                                status=status.HTTP_400_BAD_REQUEST)
                    
                new_transaction = InvestmentPlanTransaction.objects.create(amount=amount,
                                                                           current_investment=user_investment)
                
                
                
                    
                result = create_payment_request(receiver_wallet=g_settings.receiver_wallet,
                                                token=currency, value=amount)
                if result:
                    new_transaction.coinpayments_response = result
                    expire_time = timezone.now() + timezone.timedelta(minutes=30)
                    new_transaction.txn_id = result.get("id")
                    expire_payment.apply_async((new_transaction.id,), eta=expire_time)
                    new_transaction.save(update_fields=['coinpayments_response', 'txn_id'])
                    return response.Response(data=result, status=status.HTTP_201_CREATED)
                    
            else:
                return response.Response(data=pending_payment.coinpayments_response, status=status.HTTP_200_OK)
        except Exception as e:
            transaction.set_rollback(True)
            return response.Response(data=_(f"An error has ocurred to create the payment, try again. ") + str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
class VerifyPaymentView(views.APIView):
    
    
    @transaction.atomic()
    def post(self, request, *args, **kwargs):
        try:
            user_investment = UserInvestment.objects.filter(user=request.user, status=True).last()
            if not user_investment:
                user_investment = UserInvestment.objects.create(user=request.user, status=True)
                
            payment_id = request.data.get("id")
            pending_payment = user_investment.investments.filter(status=TransactionStatus.PENDING, 
                                                                 coinpayments_response__id=payment_id).last()
            
            if pending_payment:
                result = verify_payment_request(paymentId=payment_id)
                
                if result.get("status") == "2":
                    pending_payment.status = TransactionStatus.APPROVED
                    pending_payment.coinpayments_response = result
                    pending_payment.save()
                    return response.Response(data=_("Transaction paid successfully."), status=status.HTTP_200_OK)
                else:
                    return response.Response(data=_("Waiting for funds"), status=status.HTTP_400_BAD_REQUEST)
            else:
                return response.Response(data=_("User hasn't pending payments. "), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            transaction.set_rollback(True)
            return response.Response(data=_("An error has ocurred to verify the payment, try again. ")+ str(e), status=status.HTTP_400_BAD_REQUEST)
        
class InvestmentTransactionHistoryView(ReadOnlyModelViewSet):
    
    serializer_class = InvestmentTransactionSerializer
    pagination_class = BasicPaginationResponse
    
    def get_queryset(self):
        return InvestmentPlanTransaction.objects.filter(current_investment__user=self.request.user,
                                                        status=TransactionStatus.APPROVED).order_by("-date")
    
    

class InvestmentDashboardAPIView(APIView):
    """
    API View para proveer los datos agregados para el panel de inversiones del frontend.
    """
    def get(self, request, *args, **kwargs):
        """
        Calcula y devuelve los KPIs y datos necesarios para el dashboard.
        """
        approved_transactions = InvestmentPlanTransaction.objects.filter(status=TransactionStatus.APPROVED)
        all_withdrawals_sum = Withdrawal.objects.filter(status=TransactionStatus.APPROVED).aggregate(
            value=Sum('amount')).get("value") or 0
        
        total_investment_obj = approved_transactions.aggregate(total=Sum('amount'))
        total_investment_amount = total_investment_obj['total'] or 0

        total_investors = approved_transactions.values('current_investment__user').distinct().count()

        today = timezone.now().astimezone(tz=timezone.get_current_timezone())
        twelve_months_ago = today - relativedelta(months=12) # Más preciso que 365 días
        
        monthly_data = approved_transactions.filter(
            date__gte=twelve_months_ago
        ).annotate(
            month=TruncMonth('date')
        ).values(
            'month'
        ).annotate(
            total=Sum('amount')
        ).order_by('month')

        monthly_data_dict = {item['month'].strftime('%Y-%m'): item['total'] for item in monthly_data}

        chart_labels = []
        chart_values = []

        # --- INICIO DEL CÓDIGO CORREGIDO ---

        # 2. Bucle corregido usando relativedelta
        # Itera sobre los últimos 12 meses para asegurar que no haya huecos
        for i in range(12):
            # Resta meses de calendario, no un número fijo de días
            current_month_date = today - relativedelta(months=i)
            month_key = current_month_date.strftime('%Y-%m')
            
            # Usamos el formato localizado para el nombre del mes
            # ej. 'agosto' en lugar de 'August' si el locale está en español
            month_name = current_month_date.strftime('%B').capitalize()

            chart_labels.append(month_name)
            chart_values.append(monthly_data_dict.get(month_key, 0))
        
        # --- FIN DEL CÓDIGO CORREGIDO ---

        # Los datos se generan del más reciente al más antiguo, los invertimos para el gráfico
        chart_labels.reverse()
        chart_values.reverse()

        response_data = {
            'totalInvestments': total_investment_amount,
            'totalInvestors': total_investors,
            'chartData': {
                'labels': chart_labels,
                'data': chart_values,
            },
            'all_withdrawals_sum': all_withdrawals_sum
        }

        return response.Response(response_data, status=status.HTTP_200_OK)


class ReinvestmentView(views.APIView):
    """
    Handles reinvestment from user's available balance or utility balance.
    """
    @transaction.atomic()
    def post(self, request, *args, **kwargs):
        g_settings = GeneralSettings.objects.first()
        date_now = timezone.now().astimezone(tz=timezone.get_current_timezone())
        if date_now.weekday() not in g_settings.reinvestment_week_days:
            return response.Response(
                {"detail": _("Las reinversiones solo están habilitadas los días sabados y domingos.")},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user
        amount_str = request.data.get("amount")
        reinvestment_type = request.data.get("type") # Esperamos 'balance' o 'utility'

        # 1. Validación de datos de entrada
        if not amount_str or not reinvestment_type:
            return response.Response(
                {"detail": _("Cantidad y tipo son obligatorios.")},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            amount = Decimal(amount_str)
            if amount <= 0:
                raise ValueError()
        except (ValueError, TypeError):
            return response.Response(
                {"detail": _("Cantidad ingresada inválida.")},
                status=status.HTTP_400_BAD_REQUEST
            )

        if reinvestment_type not in ['balance', 'utility']:
            return response.Response(
                {"detail": _("Argumento inválido.")},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Obtener la inversión activa del usuario
        user_investment, created = UserInvestment.objects.get_or_create(user=user, status=True)

        # 3. Verificar saldo y descontar
        if reinvestment_type == 'balance':
            if amount > user.balance:
                return response.Response(
                    {"detail": _("Insuficiente saldo para reinvertir.")},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.balance -= amount
        
        elif reinvestment_type == 'utility':
            if amount > user.investment_balance: # Asegúrate de que este campo exista en tu modelo User
                return response.Response(
                    {"detail": _("Insuficiente saldo de utilidades para reinvertir.")},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.investment_balance -= amount
        
        user.save()

        # 4. Crear la transacción de inversión
        # Se crea directamente como APROBADA y se marca como reinversión
        new_transaction = InvestmentPlanTransaction.objects.create(
            amount=amount,
            status=TransactionStatus.APPROVED,
            current_investment=user_investment,
            is_reinvestment=True # ¡Importante!
        )

        return response.Response(
            {"detail": _("Reinvestment made successfully!")},
            status=status.HTTP_201_CREATED
        )