from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

# Buscar usuario admin
try:
    admin = User.objects.get(username='admin')
    print(f'Usuario "admin" encontrado - ID: {admin.id}')
    
    # Actualizar contraseña directamente en la base de datos sin disparar save()
    admin.password = make_password('Admin123')
    admin.is_staff = True
    admin.is_superuser = True
    admin.is_active = True
    
    # Usar update para evitar el método save() personalizado
    User.objects.filter(id=admin.id).update(
        password=make_password('Admin123'),
        is_staff=True,
        is_superuser=True,
        is_active=True
    )
    
    print(f'✅ Contraseña actualizada para usuario "admin"')
    print(f'Username: admin')
    print(f'Contraseña: Admin123')
    
except User.DoesNotExist:
    print('❌ Usuario "admin" no existe')
    print('Usuarios superusuarios disponibles:')
    superusers = User.objects.filter(is_superuser=True)
    for user in superusers:
        print(f'  - {user.username} ({user.email})')
