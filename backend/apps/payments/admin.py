from django.contrib import admin
from .models import DirectPayment, PasivePayment

@admin.register(DirectPayment)
class DirectPaymentAdmin(admin.ModelAdmin):
    
    list_display = ['id', 'user','date', 'transaction', 'level', 'amount']

@admin.register(PasivePayment)
class PasivePaymentAdmin(admin.ModelAdmin):
    
    list_display = ['id', 'user','date', 'amount', 'current_investment_amount', 'active_investment', 'balance_investment_pasive']