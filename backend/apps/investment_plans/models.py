from django.db import models
from django.contrib.auth.models import User
from .choices import TransactionStatus
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from apps.core.models import GeneralSettings
from apps.tree.models import Referr
from decimal import Decimal
from apps.payments.models import DirectPayment
from simple_history.models import HistoricalRecords
    
class UserInvestment(models.Model):
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_("User"), blank=False, null=False,
                             on_delete=models.CASCADE,)
    
    activation_date = models.DateTimeField(auto_now_add=True)
    
    min_time_to_withdraw = models.DateTimeField(null=True, blank=True, verbose_name=_("Date to withdraw"))
    
    earnings = models.DecimalField(default=0, verbose_name=_("Earnings"), decimal_places=2, max_digits=20)
    
    status = models.BooleanField(default=True, verbose_name=_("Investment status"))
    
    withdrawn = models.DecimalField(default=0, verbose_name=_("Withdrawn amount"), decimal_places=2, max_digits=20)
    
    history = HistoricalRecords()
    
    @property
    def total_investment_amount(self):
        amount__sum = self.investments.filter(status=TransactionStatus.APPROVED, ).aggregate(models.Sum("amount")).get("amount__sum") or 0
        withdrawn_from_deposit = self.investments.filter(status=TransactionStatus.APPROVED, ).aggregate(models.Sum("withdrawn_from_deposit")).get("withdrawn_from_deposit__sum") or 0
        # if amount__sum and self.withdrawn > 0:
        #     amount__sum -= self.withdrawn
        return amount__sum - withdrawn_from_deposit
    
    @property
    def is_active(self):
        g_settings = GeneralSettings.objects.first()
        return self.total_investment_amount >= g_settings.minimum_investment_amount
    
    @property
    def daily_payment(self):
        from apps.core.models import GeneralSettings
        if self.status:
            g_settings = GeneralSettings.objects.first()
            total_amount = self.total_investment_amount
            return (float(total_amount) * float(g_settings.daily_payment )) / 100 
        else:
            return 0
        
    @property
    def withdrawable_deposit_amount(self):
        """
        Calculates the total amount from individual deposits that are eligible for withdrawal.
        """
        eligible_deposits = self.investments.filter(
            status=TransactionStatus.APPROVED,
            is_free=False,
            available_for_withdrawal_date__lte=timezone.now(),
        )
        total_eligible = Decimal(0)
        for deposit in eligible_deposits:
            total_eligible += (deposit.amount - deposit.withdrawn_from_deposit)
        
        return total_eligible

    
    def __str__(self) -> str:
        return self.user.username + " - $" + str(self.total_investment_amount) + " USD"
    
    
class InvestmentPlanTransaction(models.Model):
    
    amount = models.DecimalField(default=0, verbose_name=_("Amount invest"), decimal_places=2, max_digits=20)
    
    coinpayments_response = models.JSONField(default=dict, null=True, blank=True)
    
    status = models.CharField(choices=TransactionStatus.choices, default=TransactionStatus.PENDING,
                              max_length=50, blank=True)
    
    date = models.DateTimeField(auto_now_add=True)
    
    txn_id = models.CharField(max_length=100, blank=True)
    
    current_investment = models.ForeignKey(UserInvestment, null=False, blank=False, verbose_name=_("User invest"), 
                                           related_name="investments", on_delete=models.CASCADE)
    
    pay_with_balance = models.BooleanField(default=False, verbose_name=_("Pay with balance"))
    
    before_investment_value = models.DecimalField(default=0, verbose_name=_("Before investment value"), decimal_places=2,
                                                  max_digits=20)
    
    levels_paid = models.BooleanField(default=False,)
    
    # New field: When this specific deposit is available for withdrawal
    available_for_withdrawal_date = models.DateTimeField(null=True, blank=True, verbose_name=_("Available for withdrawal date"))

    # New field: How much has been withdrawn from this specific deposit
    withdrawn_from_deposit = models.DecimalField(default=0, verbose_name=_("Withdrawn from this deposit"), decimal_places=2, max_digits=20)
    
    is_free = models.BooleanField(default=False, verbose_name="Es gratuito?")
    
    is_reinvestment = models.BooleanField(default=False, verbose_name=_("Es reinversión?"))
    pay_with_balance = models.BooleanField(default=False, verbose_name=_("Es pagado con saldo normal?"))
    
    history = HistoricalRecords()
    
    def save(self, *args, **kwargs) -> None:
        obj = super().save(*args, **kwargs)
        send_email = False
        if not kwargs.get("update_fields"):
            if self.status == TransactionStatus.APPROVED and not self.levels_paid:
                send_email = True
                g_settings = GeneralSettings.objects.first()
                level_payment = 1
                current_user = self.current_investment.user
                # self.available_for_withdrawal_date = timezone.now() + timezone.timedelta(days=g_settings.investment_blocked_days)

                if not self.is_free:
                    for level in g_settings.level_payments:
                        
                        amount_to_paid = Decimal(level / 100) * Decimal(self.amount)
                        referr = Referr.objects.filter(referred=current_user).last()
                        
                        if referr:
                            partner = referr.user
                            
                            if level_payment == 1 and partner.extra_direct_payment:
                                amount_to_paid = Decimal((level + partner.extra_direct_payment)  / 100) * Decimal(self.amount)
                                
                            DirectPayment.objects.create(amount=amount_to_paid, user=partner,
                                                        transaction=self, level=level_payment)
                            current_user = partner
                        else:
                            break
                        
                        level_payment += 1
                
                current_level = 4
                while current_user:
                    referr = Referr.objects.filter(referred=current_user).last()
                    if referr and referr.user.username != "root":
                        partner = referr.user
                        
                        amount_to_paid = Decimal(1 / 100) * Decimal(self.amount)
                        if referr.is_master_code:
                            DirectPayment.objects.create(amount=amount_to_paid, user=partner,
                                                    transaction=self, level=current_level)
                        current_user = partner
                    else:
                        break
                    current_level += 1
                self.levels_paid = True
                
            if self.status == TransactionStatus.APPROVED:
                g_settings = GeneralSettings.objects.first()

                # Bloqueo de 30 días para esta transacción específica
                if not self.available_for_withdrawal_date:
                    self.available_for_withdrawal_date = timezone.now() + timezone.timedelta(days=g_settings.investment_blocked_days) # Asumiendo que tienes este valor en settings
                
                    self.current_investment.min_time_to_withdraw = timezone.now() + timezone.timedelta(days=365) # Esto parece ser una regla global, la mantenemos
                    self.before_investment_value = self.current_investment.total_investment_amount
                    self.current_investment.save()
                    self.save(update_fields=['available_for_withdrawal_date', 'before_investment_value', 'levels_paid'])
                
                if send_email:
                    from .tasks import send_deposit_verification_email
                    from apps.authentication.tasks import send_webbhook_registration
                    from django.db import transaction
                    # Podrías crear un email diferente para reinversiones si quieres
                    send_deposit_verification_email.apply_async((self.pk,))
                    transaction.on_commit(lambda: send_webbhook_registration.apply_async((self.current_investment.user.id,)))
        return obj
    
    def __str__(self) -> str:
        return self.current_investment.user.username + " - " + str(self.amount) + " - " + str(self.date)
    
    class Meta:
        verbose_name = _("Investment plan transaction")
        verbose_name_plural = _("Investment plan transactions")

