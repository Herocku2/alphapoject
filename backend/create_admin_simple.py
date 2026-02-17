from django.contrib.auth import get_user_model

User = get_user_model()

# Crear usuario administrador
admin = User.objects.create_superuser(
    username='admin',
    email='admin@alphasentinel.com',
    password='Admin123',
    first_name='Admin',
    last_name='Alpha Sentinel',
    is_staff=True,
    is_superuser=True,
    is_active=True,
    balance=0,
    investment_balance=0
)

print(f'✅ Usuario administrador creado exitosamente')
print(f'ID: {admin.id}')
print(f'Username: {admin.username}')
print(f'Email: {admin.email}')
print(f'Ref Code: {admin.ref_code}')
print(f'Is Staff: {admin.is_staff}')
print(f'Is Superuser: {admin.is_superuser}')
print(f'Is Active: {admin.is_active}')
