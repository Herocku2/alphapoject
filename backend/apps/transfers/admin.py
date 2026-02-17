from django.contrib import admin
from .models import UserTransfer

@admin.register(UserTransfer)
class UserTransferAdmin(admin.ModelAdmin):
    """
    Panel de administración para el modelo UserTransfer.
    """
    
    # --- Configuración de la lista de transferencias ---
    list_display = (
        'sender',
        'receiver',
        'amount',
        'transfer_type',
        'timestamp',
    )
    
    list_filter = (
        'transfer_type',
        'timestamp',
    )
    
    search_fields = (
        'sender__username',
        'receiver__username',
        'sender__email',
        'receiver__email',
    )
    
    ordering = ('-timestamp',)
    
    list_per_page = 25
    
    # Mejora el rendimiento para seleccionar usuarios en entornos con muchos registros
    raw_id_fields = ('sender', 'receiver')

    # --- Configuración para que el registro sea de solo lectura ---
    
    def has_add_permission(self, request):
        # Deshabilita el botón de "Añadir"
        return False

    def has_change_permission(self, request, obj=None):
        # Deshabilita la edición de los registros
        return False

    def has_delete_permission(self, request, obj=None):
        # Permitir eliminación para que los usuarios puedan ser eliminados en cascada
        # Las transferencias se eliminarán automáticamente cuando se elimine el usuario
        return True