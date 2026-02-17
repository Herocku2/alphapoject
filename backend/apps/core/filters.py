from django_filters import FilterSet
from .models import Currency

class CurrencyFilter(FilterSet):
    
    class Meta:
        model = Currency
        fields = '__all__'
        exclude = ['logo']