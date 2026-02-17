from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.core.utils import get_media_file_url
from apps.core.models import GeneralSettings
from .models import UserTransfer

User = get_user_model()

class FoundUserSerializer(serializers.ModelSerializer):
    """
    Serializer para devolver información básica y pública de un usuario encontrado.
    """
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'avatar']
    
    # Reutilizamos la lógica para obtener la URL completa del avatar
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        avatar = ''
        if instance.avatar:
            avatar = instance.avatar.url
        else:
            g_settings = GeneralSettings.objects.first()
            if g_settings.default_user_avatar:
                avatar = g_settings.default_user_avatar.url
        representation['avatar'] = get_media_file_url(avatar)
        return representation
    
class UserTransferSerializer(serializers.ModelSerializer):
    """
    Serializer para mostrar el historial de transferencias de un usuario.
    """
    # Usamos 'source' para acceder a los usernames de los usuarios relacionados
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)
    # Para mostrar el 'label' legible en el frontend
    transfer_type_display = serializers.CharField(source='get_transfer_type_display', read_only=True)

    class Meta:
        model = UserTransfer
        fields = [
            'id', 
            'amount', 
            'timestamp', 
            'transfer_type',
            'transfer_type_display',
            'sender_username', 
            'receiver_username'
        ]