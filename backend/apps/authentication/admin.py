from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from simple_history.admin import SimpleHistoryAdmin
from .models import User, EmailVerification

# Unregister the default User admin if it exists
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass


@admin.register(User)
class UserAdmin(BaseUserAdmin, SimpleHistoryAdmin):
    """
    Administrador personalizado para el modelo User.
    """

    # --- Configuración de la Lista de Usuarios ---
    list_display = (
        'avatar_thumbnail',
        'username',
        'email',
        'phone_number',
        'balance',
        'is_staff',
    )
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'is_fundator',)
    search_fields = ('username', 'first_name', 'last_name', 'email', 'phone_number', 'usdt_wallet', 'bank_account_number')
    ordering = ('-date_joined',)

    # --- Configuración del Formulario de Edición ---
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información Personal', {'fields': ('first_name', 'last_name', 'email', 'avatar_display', 'avatar', 'phone_number')}),
        ('Finanzas Crypto', {'fields': ('usdt_wallet', 'balance', 'investment_balance', 'extra_direct_payment')}),
        
        # --- NUEVO: SECCIÓN PARA DATOS BANCARIOS ---
        ('Información Bancaria (FIAT)', {
            'classes': ('collapse',),
            'fields': (
                'bank_account_number',
                'bank_name',
                'bank_country',
                'bank_swift_code',
            ),
        }),
        # --- FIN DE LA NUEVA SECCIÓN ---

        ('Referencias y Estatus', {'fields': ('ref_code', 'is_fundator')}),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Fechas Importantes', {'fields': ('last_login', 'date_joined')}),
        ('Información Técnica', {'fields': ('ip_address',)}),
    )
    
    # --- Configuración para Agregar Nuevos Usuarios ---
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ('avatar_display', 'last_login', 'date_joined', 'ref_code')
    
    # --- Habilitar Eliminación de Usuarios ---
    def has_delete_permission(self, request, obj=None):
        """Permitir eliminación de usuarios (eliminará registros relacionados en cascada)"""
        return True
    
    # Asegurar que la acción de eliminación esté disponible
    actions = ['delete_selected']

    # --- Funciones para Campos Personalizados ---
    def avatar_thumbnail(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" width="40" height="40" style="border-radius: 50%;" />', obj.avatar.url)
        return "Sin Avatar"
    avatar_thumbnail.short_description = 'Avatar'

    def avatar_display(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" width="150" height="150" />', obj.avatar.url)
        return "No hay avatar para mostrar"
    avatar_display.short_description = 'Vista Previa del Avatar'


@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'created_at', 'expires_at', 'is_expired_display')
    search_fields = ('user__email', 'code')
    list_filter = ('created_at', 'expires_at')
    readonly_fields = ('code', 'created_at', 'expires_at', 'user')

    def is_expired_display(self, obj):
        return obj.is_expired()
    is_expired_display.short_description = 'Expirado'
    is_expired_display.boolean = True