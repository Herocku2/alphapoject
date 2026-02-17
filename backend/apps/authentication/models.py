from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from .choices import CodeStatus
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from simple_history.models import HistoricalRecords
from .tasks import send_webbhook_registration
import uuid
import random
import string

class User(AbstractUser):
    
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    ip_address = models.CharField(max_length=100, verbose_name=_("Ip address"), blank=True)
    
    phone_number = models.CharField(max_length=30, verbose_name=_('Phone number'), help_text=_('Input phone number'),
                                    blank=True)
    
    usdt_wallet = models.CharField(max_length=100, verbose_name=_("USDT wallet"), default="")
    
    balance = models.DecimalField(max_digits=20, decimal_places=4, verbose_name=_("Balance"), default=0)
    
    investment_balance = models.DecimalField(max_digits=20, decimal_places=4, verbose_name=_("Investment Balance"), default=0)
    
    ref_code = models.CharField(max_length=10, verbose_name=_("Referr code"), blank=False, default="")
    
    extra_direct_payment = models.PositiveSmallIntegerField(verbose_name=_("Extra direct payment"), help_text=_("Input extra percentage"),
                                                            default=0)
    
    is_fundator = models.BooleanField(default=False, verbose_name=_("Is fundator"), help_text=_("Check if is fundator"))
    
    # --- NUEVOS CAMPOS PARA DATOS BANCARIOS (FIAT) ---
    bank_account_number = models.CharField(max_length=50, verbose_name=_("Bank Account Number"), blank=True, default="")
    bank_name = models.CharField(max_length=100, verbose_name=_("Bank Name"), blank=True, default="")
    bank_country = models.CharField(max_length=100, verbose_name=_("Bank Country"), blank=True, default="")
    bank_swift_code = models.CharField(max_length=20, verbose_name=_("Bank Swift Code"), blank=True, default="")
    # --- FIN DE LOS NUEVOS CAMPOS ---
    
    history = HistoricalRecords()
    
    def save(self, *args, **kwargs) -> None:
        if not self.ref_code:
            referral_code = ''.join(random.choices(string.digits, k=7))
            
            while User.objects.filter(ref_code=referral_code).exists():
                referral_code = ''.join(random.choices(string.digits, k=7))
                
            self.ref_code = referral_code
        if not self.password.startswith("pbkdf2"):
            self.set_password(self.password)
        
        bef_obj=None
        
        if self.id:
            bef_obj = User.objects.get(pk=self.id)
        
        instance= super().save(*args, **kwargs)
        
        # Comentado temporalmente para permitir login sin Celery/RabbitMQ
        # if self.id:
        #     send_webbhook_registration.apply_async((self.id,))
        return instance
    
    def generate_code(self, subject="", message=""):
        new_code = random.randint(10000, 99999)
        created_at = timezone.now() 
        
        expiration_date = created_at + timezone.timedelta(minutes=15)
        actives_codes =  UserCode.objects.filter(user=self, is_active=True)
        
        if actives_codes:
            actives_codes.update(is_active=False)
            
        code = UserCode.objects.create(
            user=self,
            expiration_date=expiration_date,
            is_active=True,
            code=new_code
        )
        from .tasks import send_secret_update_profile_code
        send_secret_update_profile_code.apply_async((code.id,subject,message,))
        return new_code
    
    def verify_code(self, code):
        last_code = UserCode.objects.filter(status=CodeStatus.UNUSED, is_active=True, 
                                         user=self, code=code)
        if last_code.exists():
            last_code.update(status=CodeStatus.USED, is_active=False)
            return True
        else:
            return False
    
    
    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
    
class UserCode(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name=_('User'), related_name='expiration_codes')
    code = models.CharField(verbose_name=_('Code'), max_length=5)
    expiration_date = models.DateTimeField(verbose_name=_('Expired'), null=True)
    status = models.CharField( verbose_name=_('Status code'), choices=CodeStatus.choices, max_length=55, default=CodeStatus.UNUSED) #Estados (usado, sin usar, invalido)
    is_active = models.BooleanField(verbose_name=_('Active'), default=True) #Para saber si sigue activo

    class Meta:
        verbose_name = _('User codes')
        verbose_name_plural = _('Users codes')


    def __str__(self) -> str:
        return f'{self.user} - {self.code}'
    



# Modelo para almacenar el código de verificación de cada usuario
class EmailVerification(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='email_verification'
    )
    code = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        # Establece la fecha de expiración a 24 horas desde la creación
        if not self.id:
            self.expires_at = timezone.now() + timezone.timedelta(hours=24)
        super().save(*args, **kwargs)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Verificación para {self.user.email} - {self.code}"