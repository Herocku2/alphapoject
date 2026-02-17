# Limpieza de Base de Datos y Creación de Usuario Administrador

## Credenciales del Administrador

```
Usuario:     admin
Email:       admin@alphasentinel.com
Contraseña:  Admin123!@#
```

## Opción 1: Usar el Script Python (Recomendado)

Si tienes el entorno virtual de Django configurado, ejecuta:

```bash
cd /Volumes/DATOS/scripts/Smart\ Solution\ Febrero\ 2026/backend

# Activar entorno virtual (si existe)
source venv/bin/activate

# Ejecutar script
echo "SI" | python clean_and_create_admin.py
```

## Opción 2: Limpiar Manualmente con Django Shell

```bash
cd /Volumes/DATOS/scripts/Smart\ Solution\ Febrero\ 2026/backend

# Ejecutar Django shell
python manage.py shell

# Luego ejecutar estos comandos en el shell:
```

```python
from django.contrib.auth import get_user_model
from apps.payments.models import Payment
from apps.transfers.models import Transfer
from apps.withdrawals.models import Withdrawal
from apps.investment_plans.models import UserInvestment
from apps.tree.models import Node
from django.db import transaction

User = get_user_model()

# Limpiar datos
with transaction.atomic():
    UserInvestment.objects.all().delete()
    Payment.objects.all().delete()
    Transfer.objects.all().delete()
    Withdrawal.objects.all().delete()
    Node.objects.all().delete()
    User.objects.all().delete()

# Crear administrador
admin = User.objects.create_superuser(
    username="admin",
    email="admin@alphasentinel.com",
    password="Admin123!@#",
    first_name="Admin",
    last_name="Alpha Sentinel",
    is_staff=True,
    is_superuser=True,
    is_active=True,
    balance=0,
    investment_balance=0
)

print(f"✅ Admin creado - ID: {admin.id}, Ref Code: {admin.ref_code}")
```

## Opción 3: Eliminar y Recrear Base de Datos

```bash
cd /Volumes/DATOS/scripts/Smart\ Solution\ Febrero\ 2026/backend

# Respaldar base de datos actual (opcional)
cp db.sqlite3 db.sqlite3.backup

# Eliminar base de datos
rm db.sqlite3

# Recrear base de datos
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser
# Usuario: admin
# Email: admin@alphasentinel.com
# Contraseña: Admin123!@#
```

## Verificación

Después de ejecutar cualquiera de las opciones, puedes verificar que el usuario fue creado:

```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

admin = User.objects.get(username="admin")
print(f"Usuario: {admin.username}")
print(f"Email: {admin.email}")
print(f"Es superusuario: {admin.is_superuser}")
print(f"Ref Code: {admin.ref_code}")
```

## Archivos Creados

- [`clean_and_create_admin.py`](file:///Volumes/DATOS/scripts/Smart%20Solution%20Febrero%202026/backend/clean_and_create_admin.py) - Script completo con confirmación
- [`clean_db_script.py`](file:///Volumes/DATOS/scripts/Smart%20Solution%20Febrero%202026/backend/clean_db_script.py) - Script para Django shell

## ⚠️ Importante

- **Guarda las credenciales** en un lugar seguro
- **Cambia la contraseña** después del primer login
- Esta operación **eliminará todos los datos** de la base de datos
- No hay forma de recuperar los datos eliminados (a menos que tengas un respaldo)
