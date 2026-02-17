from django.contrib.auth import get_user_model
from apps.payments.models import Payment
from apps.transfers.models import Transfer
from apps.withdrawals.models import Withdrawal
from apps.investment_plans.models import InvestmentPlan, UserInvestment
from apps.tree.models import Node
from django.db import transaction

User = get_user_model()

print("🗑️  Limpiando base de datos...")

with transaction.atomic():
    # Eliminar datos de inversiones
    print("  - Eliminando inversiones de usuarios...")
    UserInvestment.objects.all().delete()
    
    # Eliminar pagos
    print("  - Eliminando pagos...")
    Payment.objects.all().delete()
    
    # Eliminar transferencias
    print("  - Eliminando transferencias...")
    Transfer.objects.all().delete()
    
    # Eliminar retiros
    print("  - Eliminando retiros...")
    Withdrawal.objects.all().delete()
    
    # Eliminar nodos del árbol
    print("  - Eliminando nodos del árbol...")
    Node.objects.all().delete()
    
    # Eliminar todos los usuarios
    print("  - Eliminando usuarios...")
    User.objects.all().delete()

print("✅ Base de datos limpiada exitosamente\n")

# Crear usuario administrador
print("👤 Creando usuario administrador...")

username = "admin"
email = "admin@alphasentinel.com"
password = "Admin123!@#"

admin_user = User.objects.create_superuser(
    username=username,
    email=email,
    password=password,
    first_name="Admin",
    last_name="Alpha Sentinel",
    is_staff=True,
    is_superuser=True,
    is_active=True,
    balance=0,
    investment_balance=0
)

print(f"✅ Usuario administrador creado exitosamente\n")
print("=" * 60)
print("📋 CREDENCIALES DEL ADMINISTRADOR:")
print("=" * 60)
print(f"  Usuario:     {username}")
print(f"  Email:       {email}")
print(f"  Contraseña:  {password}")
print(f"  ID:          {admin_user.id}")
print(f"  Ref Code:    {admin_user.ref_code}")
print("=" * 60)
print("\n⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro\n")
print("🎉 Proceso completado exitosamente!\n")
