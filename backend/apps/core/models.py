from typing import Iterable
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _    
from apps.tree.models import UnilevelTree
from decimal import Decimal

class GeneralSettings(models.Model):
    
    default_user_avatar = models.ImageField(upload_to='avatars/', null=True, blank=True,
                                            verbose_name=_("Default users avatar"))
    
    project_name = models.CharField(verbose_name=_("Project name"), max_length=100, default="")
    
    logo = models.ImageField(upload_to='logos/', null=True, blank=True,
                                            verbose_name=_("Logo"))
    
    dark_logo = models.ImageField(upload_to='logos/', null=True, blank=True,
                                            verbose_name=_("Dark Logo"))
    
    root_user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True,
                                  on_delete=models.SET_NULL)
    
    level_payments = models.JSONField(default=list, null=True, blank=True)
    
    currency_coin_payments = models.CharField(default="USDT.BEP20", max_length=20, verbose_name=_("Currency abbreviation"))
    
    minimum_investment_amount = models.PositiveIntegerField(default=500, verbose_name=_("Minimun investment amount"))
    
    min_withdrawal_amount = models.IntegerField(default=20, verbose_name=_("Minimum withdrawal amount"))
    
    receiver_wallet = models.CharField(max_length=200, verbose_name=_("Receiver wallet"), blank=False,
                                       default="")
    
    network_payments = models.CharField(max_length=10, verbose_name=_("Network payments"), default="BEP20",
                                        blank=False, )
    
    withdrawal_week_days = models.JSONField(default=list, blank=False, verbose_name=_("Withdrawal days"))
    
    reinvestment_week_days = models.JSONField(default=list, blank=False, verbose_name=_("Reinvestment days"))
    
    daily_payment = models.DecimalField(max_digits=12, decimal_places=4, verbose_name=_("Daily payment"),
                                        default=1)
    
    investment_blocked_days = models.SmallIntegerField(default=30, verbose_name=_("Blocked days for investment"),
                                                       )
    
    offset_amount_payments = models.PositiveSmallIntegerField(default=1, verbose_name="Diferencia maxima aceptada entre pagos")
    
    min_fiat_withdrawable = models.PositiveIntegerField(default=500, )
    
    disable_deposits = models.BooleanField(default=False, verbose_name="Deshabilitar depositos de la plataforma")
    
    disable_deposits_message = models.TextField(verbose_name="Mensaje que se muestra al deshabilitar los despositos", 
                                                   default="")
    
    def save(self, *args, **kwargs) -> None:
        
        if self.root_user:
            try:
                nodes = UnilevelTree().get_root_nodes()
                if nodes:
                    binary_tree_root = UnilevelTree().get_root_nodes()[0]
                else:
                    binary_tree_root = UnilevelTree().add_root(user=self.root_user)
            except UnilevelTree.DoesNotExist as e:
                binary_tree_root = UnilevelTree.add_root(user=self.root_user)
            if binary_tree_root:
                if binary_tree_root.user != self.root_user:
                    binary_tree_root.user = self.root_user
                    binary_tree_root.save()
            
            
               
                
        return super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = _("General settings")
        verbose_name_plural = _("General settings")


class CustomPercentageGroup(models.Model):
    """
    Model to define custom daily payment percentages for specific user groups.
    Users in a group will receive a custom percentage instead of the default one.
    """
    name = models.CharField(max_length=100, verbose_name=_("Group name"), 
                           help_text=_("Descriptive name for this percentage group"))
    
    percentage = models.DecimalField(max_digits=12, decimal_places=4, 
                                     verbose_name=_("Daily payment percentage"),
                                     help_text=_("Custom daily payment percentage for users in this group"))
    
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, 
                                   related_name='percentage_groups',
                                   blank=True,
                                   verbose_name=_("Users"),
                                   help_text=_("Users who will receive this custom percentage"))
    
    is_active = models.BooleanField(default=True, verbose_name=_("Is active"),
                                    help_text=_("Only active groups will be applied"))
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created at"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated at"))
    
    def __str__(self):
        return f"{self.name} - {self.percentage}%"
    
    class Meta:
        verbose_name = _("Custom percentage group")
        verbose_name_plural = _("Custom percentage groups")
        ordering = ['-created_at']