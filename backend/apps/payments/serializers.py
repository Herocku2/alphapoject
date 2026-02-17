from rest_framework import serializers
from .models import  DirectPayment, PasivePayment

class DirectPaymentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = DirectPayment
        fields ='__all__'
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user_username'] = instance.transaction.current_investment.user.username
        representation['user_email'] = instance.transaction.current_investment.user.email
        representation['investment_amount'] = instance.transaction.amount
        return representation 
        
class PasivePaymentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PasivePayment
        fields ='__all__'
        
    def to_representation(self, instance: PasivePayment):
        representation = super().to_representation(instance)
        representation['investment_amount'] = instance.current_investment_amount
        return representation