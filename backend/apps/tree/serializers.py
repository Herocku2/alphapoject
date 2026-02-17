from rest_framework import serializers
from .models import Referr
from apps.investment_plans.models import UserInvestment

class ReferrSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Referr
        fields = '__all__'
        
    def to_representation(self, instance: Referr):
        representation = super().to_representation(instance)
        representation['referred_username'] = instance.referred.username
        representation['referred_email'] = instance.referred.email
        representation['referred_phone_number'] = instance.referred.phone_number
        status =  UserInvestment.objects.filter(user=instance.referred, status=True, investments__amount__gt=0, investments__status=2)
        representation['status'] = status.exists()
        return representation