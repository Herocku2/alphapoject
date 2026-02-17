#!/usr/bin/env python
"""
Script para limpiar completamente la base de datos y crear un usuario administrador.
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'capital_market.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.payments.models import Payment
from apps.transfers.models import Transfer
from apps.withdrawals.models import Withdrawal
from apps.investment_plans.models import InvestmentPlan, UserInvestment
from apps.tree.models import Node
from django.db import transaction

User = get_user_model()

def clean_database():
    """Elimina todos los usuarios y datos relacionados"""
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

def create_admin_user():
    """Crea un usuario administrador"""
    print("👤 Creando usuario administrador...")
    
    # Credenciales del administrador
    username = "admin"
    email = "admin@alphasentinel.com"
    password = "Admin123!@#"
    
    # Crear usuario administrador
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
    
    return admin_user

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("  LIMPIEZA DE BASE DE DATOS Y CREACIÓN DE ADMINISTRADOR")
    print("=" * 60 + "\n")
    
    # Confirmar acción
    confirm = input("⚠️  ¿Estás seguro de que quieres eliminar TODOS los datos? (escribe 'SI' para confirmar): ")
    
    if confirm == "SI":
        clean_database()
        create_admin_user()
        print("🎉 Proceso completado exitosamente!\n")
    else:
        print("❌ Operación cancelada\n")
