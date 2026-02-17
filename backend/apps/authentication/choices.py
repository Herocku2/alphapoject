from django.db.models import TextChoices
from django.utils.translation import gettext_lazy as  _

class CodeStatus(TextChoices):
    USED = '1', _('Used')
    UNUSED = '2', _('Unused')
    INVALID = '3', _('Invalid')
    VERIFIED = '4', _('Verified')
