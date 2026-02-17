from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class UserTransfer(models.Model):
    class TransferType(models.TextChoices):
        BALANCE = 'balance', _('From Referral Balance')
        UTILITY = 'utility', _('From Utility Balance')
        INVESTMENT = 'investment', _('From Withdrawable Investment')

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='sent_transfers',
        verbose_name=_("Sender")
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='received_transfers',
        verbose_name=_("Receiver")
    )
    amount = models.DecimalField(_("Amount"), max_digits=20, decimal_places=2)
    timestamp = models.DateTimeField(_("Timestamp"), auto_now_add=True)
    
    transfer_type = models.CharField(
        _("Transfer Type"),
        max_length=20,
        choices=TransferType.choices
    )
    
    class Meta:
        verbose_name = _("User Transfer")
        verbose_name_plural = _("User Transfers")
        ordering = ['-timestamp']

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username} - ${self.amount}"