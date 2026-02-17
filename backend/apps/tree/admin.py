from django.contrib import admin
from django.utils.html import format_html
from treebeard.admin import TreeAdmin
from treebeard.forms import movenodeform_factory
from .models import UnilevelTree, Referr

class UnilevelTreeAdmin(TreeAdmin):
    """
    Admin personalizado para UnilevelTree con visualización de niveles
    y restricción de profundidad máxima de 5 niveles.
    """
    form = movenodeform_factory(UnilevelTree)
    
    list_display = ('user', 'level_display', 'can_add_child_display', 'parent_display')
    list_filter = ('depth',)
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('level_display', 'can_add_child_display', 'parent_display')
    
    def level_display(self, obj):
        """Muestra el nivel del nodo con indicador visual"""
        level = obj.get_level()
        max_depth = UnilevelTree.MAX_DEPTH
        
        # Color según el nivel
        if level == 1:
            color = '#28a745'  # Verde para raíz
        elif level >= max_depth:
            color = '#dc3545'  # Rojo para nivel máximo
        else:
            color = '#007bff'  # Azul para niveles intermedios
        
        return format_html(
            '<strong style="color: {};">Nivel {} de {}</strong>',
            color, level, max_depth
        )
    level_display.short_description = 'Nivel en el Árbol'
    
    def can_add_child_display(self, obj):
        """Indica si se puede agregar un hijo a este nodo"""
        can_add = obj.can_add_child()
        if can_add:
            return format_html('<span style="color: green;">✓ Sí</span>')
        else:
            return format_html('<span style="color: red;">✗ No (Nivel máximo alcanzado)</span>')
    can_add_child_display.short_description = '¿Puede agregar hijo?'
    
    def parent_display(self, obj):
        """Muestra el padre del nodo"""
        parent = obj.get_parent()
        if parent:
            return f"{parent.user.username} (Nivel {parent.get_level()})"
        return "Raíz (Sin padre)"
    parent_display.short_description = 'Nodo Padre'

admin.site.register(UnilevelTree, UnilevelTreeAdmin)
admin.site.register(Referr)