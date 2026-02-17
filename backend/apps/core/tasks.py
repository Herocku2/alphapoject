from celery import shared_task
from apps.investment_plans.models import UserInvestment
from apps.payments.models import PasivePayment
from apps.core.models import GeneralSettings, CustomPercentageGroup
from decimal import Decimal
from django.utils import timezone
from django.db.models import Sum


@shared_task
def execute_daily_pasive():
    all_investments = UserInvestment.objects.filter(status=True)
    g_settings = GeneralSettings.objects.first()
    
    for investment in all_investments:
        date_now = timezone.now()
        all_pasive_payments_before = PasivePayment.objects.filter(user=investment.user,
                                                                date__date__lt=date_now)
        investment_amount = investment.total_investment_amount
        amount = Decimal(all_pasive_payments_before.aggregate(value=Sum('amount')).get("value") or 0) + investment_amount
        
        # Check if user belongs to a custom percentage group
        custom_group = CustomPercentageGroup.objects.filter(
            users=investment.user,
            is_active=True
        ).first()
        
        # Use custom percentage if user is in a group, otherwise use general settings percentage
        if custom_group:
            daily_percentage = custom_group.percentage
        else:
            daily_percentage = g_settings.daily_payment if g_settings else Decimal('1.0')
        
        # Calculate daily payment with the appropriate percentage
        daily_payment_amount = (Decimal(investment_amount) * daily_percentage) / Decimal('100')
        
        if daily_payment_amount > 0:
            PasivePayment.objects.create(user=investment.user, amount=daily_payment_amount,
                                        current_investment_amount=investment_amount,
                                        active_investment=investment, balance_investment_pasive=amount)
    return "Success approved for "+ str(all_investments.count()) + " users!"