from apps.core.models import GeneralSettings
from django.db import models, transaction
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from .choices import WithdrawalType, CodeStatuses
from apps.investment_plans.choices import TransactionStatus
from apps.investment_plans.models import UserInvestment
from django.utils import timezone
import random
import string

class WithdrawalMethod(models.TextChoices):
    CRYPTO = 'crypto', _('Crypto')
    FIAT = 'fiat', _('FIAT')


class Withdrawal(models.Model):
    

    method = models.CharField(
        _("Withdrawal Method"),
        max_length=10,
        choices=WithdrawalMethod.choices,
        default=WithdrawalMethod.CRYPTO
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False, on_delete=models.CASCADE,
                             verbose_name=_("User"))
    
    type = models.CharField(choices=WithdrawalType.choices, default=WithdrawalType.DIRECT, blank=False,
                            max_length=50)
    
    amount = models.DecimalField(default=0, decimal_places=2, max_digits=20, verbose_name=_("Withdrawn amount"),)
    
    date = models.DateTimeField(auto_now_add=True, verbose_name=_("Withdrawn date"))
    
    payed_date = models.DateTimeField(null=True, verbose_name=_("Withdrawn payed date"), blank=True)
    
    status = models.CharField(choices=TransactionStatus.choices, default=TransactionStatus.PENDING, null=False,
                              blank=False, max_length=100)
    
    fee = models.DecimalField(max_digits=15, decimal_places=2, verbose_name=_("Fee"), default=0, blank=True)
    
    payment_link = models.CharField(max_length=500, verbose_name=_("Payment link (Tron scan)"), blank=True)
    
    wallet_address = models.CharField(max_length=100, verbose_name=_("Wallet address"), default="",
                                      blank=True)
    
    used_code = models.ForeignKey("withdrawals.SecretCode", on_delete=models.CASCADE, null=True,
                                  blank=True, verbose_name=_("Used code"))
    
    refuse_message = models.TextField(default="", verbose_name="Mensaje de rechazo", blank=True)
    
        # --- NUEVOS CAMPOS PARA GUARDAR DATOS FIAT DE LA TRANSACCIÓN ---
    bank_account_number = models.CharField(_("Account Number"), max_length=100, blank=True, default="")
    bank_bank_name = models.CharField(_("Bank Name"), max_length=255, blank=True, default="")
    bank_country = models.CharField(_("Country (Bank)"), max_length=100, blank=True, default="")
    bank_swift_code = models.CharField(_("SWIFT/BIC Code"), max_length=20, blank=True, default="")
    payment_invoice = models.FileField(blank=True, null=True)
    # --- FIN DE NUEVOS CAMPOS ---
    
    def save(self,*args, **kwargs) -> None:
        approved = False
        if self.status == TransactionStatus.APPROVED and not self.payed_date:
            self.payed_date = timezone.now()
            approved = True
        
        if not self.id:
            if self.method == WithdrawalMethod.CRYPTO:
                if not self.wallet_address:
                    raise ValueError(_("Please select a valid wallet address in your profile."))
                
            g_settings = GeneralSettings.objects.first()
            date_now = timezone.now().astimezone(tz=timezone.get_default_timezone())
            if not date_now.weekday() in g_settings.withdrawal_week_days and not self.user.is_superuser:
                raise ValueError(_("Sorry, Withdrawals are only available on Thursdays and Fridays"))
            if self.used_code:
                self.used_code.status = CodeStatuses.USED
                self.used_code.save()
            
        # print( self.type)
        # breakpoint()
        if self.status == TransactionStatus.REFUSED and not self.payed_date:
            self.payed_date = timezone.now()
            
            if self.type == WithdrawalType.DIRECT:
                self.user.balance += self.amount
            elif self.type == WithdrawalType.PASIVE:
                self.user.investment_balance += self.amount
            elif self.type == WithdrawalType.INVESTMENT:
                user_investment = UserInvestment.objects.select_for_update().filter(user=self.user).last()
                # breakpoint()
                if user_investment:
                    # Get all approved deposits ordered by most recent first
                    deposits = user_investment.investments.select_for_update().filter(
                        status=TransactionStatus.APPROVED
                    ).order_by('-date')
                    
                    remaining_to_restore = self.amount
                    
                    # Distribute the restoration across deposits starting from the most recent
                    for deposit in deposits:
                        if remaining_to_restore <= 0:
                            break  # All amount has been restored
                        
                        # Calculate how much we can restore to this deposit
                        # We can only restore up to what was withdrawn from it
                        max_restorable = deposit.withdrawn_from_deposit
                        amount_to_restore = min(remaining_to_restore, max_restorable)
                        
                        # Restore the amount
                        deposit.withdrawn_from_deposit -= amount_to_restore
                        remaining_to_restore -= amount_to_restore
                        deposit.save()
                    
                    # Also update the UserInvestment.withdrawn field
                    # user_investment.withdrawn -= self.amount
                    # # Ensure it doesn't go below 0
                    # if user_investment.withdrawn < 0:
                    #     raise ValueError(_("Not enough funds to complete withdrawal."))
                    if not user_investment.status:
                        user_investment.status = True
                    user_investment.save()
            self.user.save()
            
        instance = super().save(*args, **kwargs)
        
        if approved:
            from .tasks import send_withdrawal_made_details
            
            transaction.on_commit(func=lambda : send_withdrawal_made_details.apply_async((self.id,)))
            
        return instance
    
    def __str__(self) -> str:
        return self.user.username + " - "+ str(self.date) + " - $" + str(self.amount) +" USD"

    class Meta:
        verbose_name = _("Withdrawal")
        verbose_name_plural = _("Withdrawals")
        ordering = ['-date']
        unique_together = ['user', 'used_code']
        
class SecretCode(models.Model):
    
    code = models.CharField(max_length=10, verbose_name=_("Verification code"), blank=False)
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, on_delete=models.CASCADE, verbose_name=_("User"))
    
    status = models.CharField(choices=CodeStatuses.choices, default=CodeStatuses.UNUSED, max_length=50,
                              verbose_name=_("Code statuses"))
    
    created_date = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs) -> None:
        
        if not self.code:
            code = ''.join(random.choices(string.digits, k=7))
                
            while SecretCode.objects.filter(code=code).exists():
                code = ''.join(random.choices(string.digits, k=7))
                
            self.code = code
            
        instance = super().save(*args, **kwargs)
        
        if self.id and self.status == CodeStatuses.UNUSED:
            from .tasks import send_secret_withdrawal_code
            send_secret_withdrawal_code.apply_async((self.id, ))
        return  instance
    
    
    def __str__(self) -> str:
        return self.user.username + " - "+ self.code 
    
    class Meta:
        verbose_name = _("Withdrawal confirmation code")
        verbose_name_plural = _("Withdrawal confirmation codes")