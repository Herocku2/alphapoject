from rest_framework import serializers
from .models import User
from apps.core.models import GeneralSettings
from apps.investment_plans.models import UserInvestment
from apps.core.utils import get_media_file_url

class UserSerializer(serializers.ModelSerializer):
    
    ref_code = serializers.CharField(read_only=True)
    phone_number = serializers.CharField(required=True)
    username = serializers.CharField(required=False)
    password= serializers.CharField(write_only=True, required=False)
    is_fundator = serializers.BooleanField(required=False, read_only=True)
    
    class Meta:
        fields = ['username', 'first_name','last_name', 'email', 'avatar', 'ref_code', 
                  'phone_number','usdt_wallet','password', 'is_fundator', "bank_name",
                  "bank_account_number", "bank_country", "bank_swift_code"]
        model = User
        
    def to_representation(self, instance: User):
        representation = super().to_representation(instance)
        avatar = ''
        if instance.avatar:
            avatar = instance.avatar.url
        else:
            g_settings = GeneralSettings.objects.first()
            if g_settings.default_user_avatar:
                avatar = g_settings.default_user_avatar.url
        representation['avatar'] = get_media_file_url(avatar)
        representation['balance'] = instance.balance
        
        representation['utility_balance'] = instance.investment_balance
        representation["investment_balance"] = 0
        user_investment = UserInvestment.objects.filter(user=instance, status=True).first()
        if user_investment:
            representation['investment_balance'] += user_investment.withdrawable_deposit_amount
        representation['is_superuser'] = instance.is_superuser
        return representation
    
from rest_framework import serializers

# ... (puedes tener otros serializers aquí) ...

class EmailVerificationSerializer(serializers.Serializer):
    """
    Serializer para validar el código de verificación (UUID) enviado desde el frontend.
    """
    code = serializers.UUIDField()
