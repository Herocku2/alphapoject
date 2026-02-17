from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import Withdrawal, TransactionStatus
from apps.investment_plans.models import InvestmentPlanTransaction
from apps.investment_plans.choices import TransactionStatus as InvestmentTransactionStatus
from .choices import WithdrawalType

@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    """
    Panel de administración personalizado para el modelo Withdrawal.
    """
    
    actions = ['mark_as_paid', 'mark_as_rejected']

    # --- Configuración de la lista de retiros ---
    list_display = (
        'user',
        'amount',
        'get_investment_at_withdrawal',
        'type',
        'method',  # CAMBIADO: Añadido para ver el método rápidamente
        'status',
        'date',
        'payed_date',
    )
    # CAMBIADO: Añadido 'method' para poder filtrar por Crypto o bank
    list_filter = ('status', 'type', 'method', 'date') 
    # CAMBIADO: Añadidos campos bank a la búsqueda
    search_fields = ('user__username', 'user__email', 'wallet_address', 'bank_full_name', 'bank_account_number')
    ordering = ('-date',)
    list_per_page = 25
    
    raw_id_fields = ('user', 'used_code')

    # --- Configuración del formulario de edición ---
    # CAMBIADO: Reorganizamos los fieldsets para separar Crypto y bank
    fieldsets = (
        ('Información Principal', {
            'fields': ('user', 'amount', 'get_investment_at_withdrawal_display', 'type', 'method', 'status', 'date')
        }),
        # NUEVO: Fieldset exclusivo para retiros Crypto
        ('Detalles de Retiro Crypto', {
            'classes': ('collapse',), # Opcional: para que aparezca colapsado
            'fields': ('wallet_address', 'fee', 'clickable_payment_link')
        }),
        # NUEVO: Fieldset exclusivo para retiros bank
        ('Detalles de Retiro bank', {
            'classes': ('collapse',),
            'fields': ('bank_bank_name', 'bank_account_number', 'bank_country', 'bank_swift_code')
        }),
        ('Estado y Rechazo', {
            'fields': ('payed_date', 'refuse_message')
        }),
        ('Información Adicional', {
            'fields': ('used_code',)
        }),
    )
    # CAMBIADO: Añadimos los nuevos campos como de solo lectura,
    # ya que son una "foto" de la transacción y no deben modificarse.
    readonly_fields = (
        'date', 
        'payed_date', 
        'clickable_payment_link',
        'method',
        'bank_bank_name', 
        'bank_account_number', 
        'bank_country', 
        'bank_swift_code',
        'get_investment_at_withdrawal_display'
    )

    def get_investment_at_withdrawal(self, obj):
        """
        Display investment amount at the time of withdrawal in the list view
        """
        if obj.type == WithdrawalType.INVESTMENT:
            try:
                last_investment_transaction = InvestmentPlanTransaction.objects.filter(
                    current_investment__user=obj.user,
                    status=InvestmentTransactionStatus.APPROVED,
                    date__lte=obj.date
                ).order_by('-date').first()
                
                if last_investment_transaction:
                    investment_at_withdrawal = (
                        last_investment_transaction.before_investment_value + 
                        last_investment_transaction.amount
                    )
                    # Color warning if withdrawal is greater than investment
                    if obj.amount > investment_at_withdrawal:
                        return format_html(
                            '<span style="color: red; font-weight: bold;">${:,.2f}</span>',
                            investment_at_withdrawal
                        )
                    return f"${investment_at_withdrawal:,.2f}"
                return "N/A"
            except Exception as e:
                return "Error"
        return "-"
    get_investment_at_withdrawal.short_description = 'Investment at Withdrawal'
    
    def get_investment_at_withdrawal_display(self, obj):
        """
        Display investment amount at the time of withdrawal in the detail view
        """
        if obj.type == WithdrawalType.INVESTMENT:
            try:
                last_investment_transaction = InvestmentPlanTransaction.objects.filter(
                    current_investment__user=obj.user,
                    status=InvestmentTransactionStatus.APPROVED,
                    date__lte=obj.date
                ).order_by('-date').first()
                
                if last_investment_transaction:
                    investment_at_withdrawal = (
                        last_investment_transaction.before_investment_value + 
                        last_investment_transaction.amount
                    )
                    return f"${investment_at_withdrawal:,.2f}"
                return "N/A - No investment transaction found"
            except Exception as e:
                return f"Error: {str(e)}"
        return "Not applicable (withdrawal type is not INVESTMENT)"
    get_investment_at_withdrawal_display.short_description = 'Investment Amount at Withdrawal Time'

    def clickable_payment_link(self, obj):
        if obj.payment_link:
            return format_html('<a href="{}" target="_blank">Ver Transacción</a>', obj.payment_link)
        return "N/A"
    clickable_payment_link.short_description = 'Enlace de Pago'

    # --- Lógica de las acciones (sin cambios) ---
    @admin.action(description='Marcar seleccionados como Pagados')
    def mark_as_paid(self, request, queryset):
        queryset.update(status=TransactionStatus.APPROVED, payed_date=timezone.now())
        self.message_user(request, f"{queryset.count()} retiros han sido marcados como pagados.")

    @admin.action(description='Marcar seleccionados como Rechazados')
    def mark_as_rejected(self, request, queryset):
        queryset.update(status=TransactionStatus.REFUSED)
        self.message_user(request, f"{queryset.count()} retiros han sido marcados como rechazados.")