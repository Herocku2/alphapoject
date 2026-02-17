from django.db import models
from django.utils.translation import gettext_lazy as _

class WithdrawalType(models.TextChoices):
    
    PASIVE = "1", _("Utilidad")
    DIRECT = "2", _("Saldo")
    INVESTMENT = "3", _("Inversión")
    
class CodeStatuses(models.TextChoices):
    
    UNUSED = "1", _("Unused")
    USED = "2", _("Used")
    EXPIRED = "3", _("Expired")