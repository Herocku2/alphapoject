from django.contrib import admin
from .models import InvestmentPlanTransaction, UserInvestment, InvestmentPlanTransaction
from django.db.models import OuterRef, Subquery, DateTimeField
from .choices import TransactionStatus
from simple_history.admin import SimpleHistoryAdmin

class InvestmentPlanTransactionInline(admin.StackedInline):
    model = InvestmentPlanTransaction
    extra = 1  # Number of empty forms to display
    
    def get_queryset(self, request):
        return super().get_queryset(request).order_by("-date")

class UserInvestmentAdmin(SimpleHistoryAdmin):
    list_display = ["user",  "activation_date","total_investment_amount", "min_time_to_withdraw", "earnings", "withdrawn", "status"]
    inlines = [InvestmentPlanTransactionInline]
    readonly_fields = ["user"]
    
    # Configure history display
    history_list_display = ['status', 'earnings', 'withdrawn']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        last_approved_date = InvestmentPlanTransaction.objects.filter(
            current_investment=OuterRef('pk'),  # Ajusta según tu modelo
        ).order_by('-date')

        return qs.annotate(
            last_approved_date=Subquery(
                last_approved_date.values('date')[:1],
                output_field=DateTimeField()
            )
        ).order_by('-last_approved_date')  # Más recientes primero

admin.site.register(UserInvestment, UserInvestmentAdmin)


@admin.register(InvestmentPlanTransaction)
class InvestmentPlanTransactionHistoryAdmin(SimpleHistoryAdmin):
    """
    Admin with history tracking for InvestmentPlanTransaction.
    Shows all transactions with their complete change history.
    """
    list_display = [
        'id',
        'current_investment',
        'amount',
        'status',
        'date',
        'is_reinvestment',
        'is_free',
        'pay_with_balance',
        'levels_paid',
    ]
    
    list_filter = [
        'status',
        'is_reinvestment',
        'is_free',
        'pay_with_balance',
        'levels_paid',
        'date',
    ]
    
    search_fields = [
        'current_investment__user__username',
        'current_investment__user__email',
        'txn_id',
    ]
    
    readonly_fields = [
        'date',
        'before_investment_value',
        'available_for_withdrawal_date',
        'coinpayments_response',
    ]
    
    fieldsets = (
        ('Transaction Information', {
            'fields': (
                'current_investment',
                'amount',
                'status',
                'date',
                'txn_id',
            )
        }),
        ('Payment Details', {
            'fields': (
                'pay_with_balance',
                'is_reinvestment',
                'is_free',
                'levels_paid',
            )
        }),
        ('Withdrawal Information', {
            'fields': (
                'before_investment_value',
                'available_for_withdrawal_date',
                'withdrawn_from_deposit',
            )
        }),
        ('Additional Data', {
            'fields': (
                'coinpayments_response',
            ),
            'classes': ('collapse',),
        }),
    )
    
    # Configure history display
    history_list_display = ['status', 'amount', 'levels_paid']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'current_investment',
            'current_investment__user'
        ).order_by('-date')
