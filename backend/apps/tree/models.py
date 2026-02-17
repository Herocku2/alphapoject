from django.db import models
from treebeard.ns_tree import NS_Node
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.core.exceptions import ValidationError

class UnilevelTree(NS_Node):
    """
    Árbol Unilevel con profundidad máxima de 5 niveles.
    Nivel 1 = Raíz, Nivel 5 = Máxima profundidad
    """
    MAX_DEPTH = 5  # Profundidad máxima permitida
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, null=False, verbose_name=_('User'),
                             help_text=_('Select user to add in the tree'), on_delete=models.CASCADE, unique=True)

    def __str__(self):
        return f"{self.user.username} (Nivel {self.get_level()})"
    
    def get_level(self):
        """
        Retorna el nivel del nodo en el árbol (1-indexed).
        Nivel 1 = Raíz, Nivel 5 = Máxima profundidad
        """
        return self.depth
    
    def can_add_child(self):
        """
        Verifica si se puede agregar un hijo a este nodo.
        Retorna True si el nodo actual está en nivel 4 o menos.
        """
        return self.get_level() < self.MAX_DEPTH
    
    def clean(self):
        """
        Validación antes de guardar el nodo.
        Verifica que no se exceda la profundidad máxima.
        """
        super().clean()
        parent = self.get_parent()
        if parent:
            parent_level = parent.get_level()
            if parent_level >= self.MAX_DEPTH:
                raise ValidationError(
                    f'No se puede agregar un nodo hijo. El padre está en el nivel {parent_level} '
                    f'y la profundidad máxima es {self.MAX_DEPTH} niveles.'
                )
    
    def save(self, *args, **kwargs):
        """
        Sobrescribir save para ejecutar validaciones.
        """
        self.clean()
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = _("Unilevel Tree")
        verbose_name_plural = _("Unilevel Tree")
    
    


class Referr(models.Model):
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('User'), help_text=_('Select User'), 
                                on_delete=models.CASCADE, null=False)
    
    referred = models.OneToOneField(settings.AUTH_USER_MODEL, verbose_name=_('Refrerred'), help_text=_('Select user'), 
                                on_delete=models.CASCADE, null=False,related_name="referred")
    
    is_master_code = models.BooleanField(default=False, verbose_name=_("Is master code"), 
                                         help_text=_("Check for master code"))

    date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return str(self.user) +' --> '+str(self.referred)
    
    class Meta:
        verbose_name = _('Referr')
        verbose_name_plural = _('Referrers')
        unique_together =['user', 'referred']
    