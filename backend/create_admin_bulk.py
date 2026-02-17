from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
import random
import string

User = get_user_model()

# Generar ref_code
referral_code = ''.join(random.choices(string.digits, k=7))
while User.objects.filter(ref_code=referral_code).exists():
    referral_code = ''.join(random.choices(string.digits, k=7))

# Crear usuario sin llamar save() que dispara el webhook
admin = User(
    username='admin',
    email='admin@alphasentinel.com',
    password=make_password('Admin123'),
    first_name='Admin',
    last_name='Alpha Sentinel',
    is_staff=True,
    is_superuser=True,
    is_active=True,
    balance=0,
    investment_balance=0,
    ref_code=referral_code
)

# Guardar directamente sin disparar señales
User.objects.bulk_create([admin])

# Obtener el usuario creado
admin_user = User.objects.get(username='admin')

print(f'✅ Usuario administrador creado exitosamente')
print(f'ID: {admin_user.id}')
print(f'Username: {admin_user.username}')
print(f'Email: {admin_user.email}')
print(f'Ref Code: {admin_user.ref_code}')
print(f'Is Staff: {admin_user.is_staff}')
print(f'Is Superuser: {admin_user.is_superuser}')
print(f'Is Active: {admin_user.is_active}')
print(f'\nCredenciales:')
print(f'Usuario: admin')
print(f'Contraseña: Admin123')
