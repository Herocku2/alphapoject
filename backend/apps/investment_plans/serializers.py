from rest_framework.serializers import ModelSerializer
from .models import InvestmentPlanTransaction

class InvestmentTransactionSerializer(ModelSerializer):
    
    class Meta:
        model = InvestmentPlanTransaction
        fields = '__all__'