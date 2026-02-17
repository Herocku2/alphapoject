from typing import Iterable
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.dispatch import receiver
from django.db.models.signals import post_delete

class BaseUserPayment(models.Model):
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False, verbose_name=_("User"),
                             on_delete=models.CASCADE)
    
    date = models.DateTimeField(auto_now_add=True, verbose_name=_("Payment date"))
    
    class Meta:
        verbose_name = _("Base user payment")
        verbose_name_plural = _("Base user payments")
        
    
class DirectPayment(BaseUserPayment):
    
    amount = models.DecimalField(decimal_places=2, max_digits=20, verbose_name=_("Amount paid"), default=0)
    
    transaction = models.ForeignKey("investment_plans.InvestmentPlanTransaction", on_delete=models.CASCADE, null=False,
                                     blank=False)
    
    level = models.PositiveSmallIntegerField(default=1, verbose_name=_("Level payment"))
    
    def save(self, *args, **kwargs) -> None:
        if not self.id:
            self.user.balance += self.amount
            self.user.save(update_fields=['balance'])
        return super().save( *args, **kwargs)

    def __str__(self) -> str:
        return self.user.username + " - $" + str(self.amount) +" USD"
    
    class Meta:
        verbose_name = _("Direct Payment")
        verbose_name_plural = _("Direct payments")
    
@receiver(post_delete, sender=DirectPayment)
def _post_delete_direct_payment(sender,instance, **kwargs):
    instance.user.balance -= instance.amount
    instance.user.save(update_fields=['balance'])


class PasivePayment(BaseUserPayment):
    
    amount = models.DecimalField(decimal_places=4, max_digits=20, verbose_name=_("Amount paid"), default=0)
    
    current_investment_amount = models.DecimalField(decimal_places=4, max_digits=20, verbose_name=_("Current investment amount"), default=0)
    
    active_investment = models.ForeignKey("investment_plans.UserInvestment", null=False, blank=False, related_name="pasive_payments",
                                          on_delete=models.CASCADE, verbose_name=_("Active user investment"))
    
    balance_investment_pasive = models.DecimalField(decimal_places=2, max_digits=20, verbose_name=_("Investment progress"),
                                                    default=0)
    
    def save(self, *args, **kwargs) -> None:
        if not self.id:
            self.user.investment_balance += self.amount
            self.user.save(update_fields=['investment_balance'])
        return super().save(*args, **kwargs)
    
    def __str__(self) -> str:
        return self.user.username + " - $" + str(self.amount) +" USD"
    
    class Meta:
        verbose_name = _("Pasive payment")
        verbose_name_plural = _("Pasive payments")
        
@receiver(post_delete, sender=PasivePayment)
def _post_delete_pasive_payment(sender,instance, **kwargs):
    instance.user.investment_balance -= instance.amount
    instance.user.save(update_fields=['investment_balance'])
    