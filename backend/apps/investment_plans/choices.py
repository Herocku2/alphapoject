from django.db import models
from django.utils.translation import gettext_lazy as _

class TransactionStatus(models.TextChoices):

    PENDING = "1", _('Pending')
    APPROVED = "2", _('Approved')
    REFUSED = "3", _('Refused')  
    EXPIRED = "4", _('Expired') 