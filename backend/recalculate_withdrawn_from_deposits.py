#!/usr/bin/env python
"""
Script para recalcular withdrawn_from_deposit basándose en los retiros y transferencias reales
Ejecutar con: python manage.py shell < recalculate_withdrawn_from_deposits.py
O dentro de Django shell: exec(open('recalculate_withdrawn_from_deposits.py').read())

Este script:
1. Resetea todos los withdrawn_from_deposit a 0
2. Por cada retiro de inversión aprobado, distribuye el monto en los depósitos del usuario
3. Por cada transferencia de inversión enviada, distribuye el monto en los depósitos del emisor
4. Si el usuario retiró/transfirió más de lo que tenía, el exceso se mete en el primer depósito
"""

from apps.investment_plans.models import UserInvestment, InvestmentPlanTransaction
from apps.investment_plans.choices import TransactionStatus
from apps.withdrawals.models import Withdrawal
from apps.withdrawals.choices import WithdrawalType
from apps.transfers.models import UserTransfer
from decimal import Decimal
from django.db import transaction

print("=" * 80)
print("RECALCULANDO WITHDRAWN_FROM_DEPOSIT BASADO EN RETIROS REALES")
print("=" * 80)
print()

# Confirmar antes de ejecutar
print("⚠️  ADVERTENCIA: Este script va a:")
print("   1. Resetear TODOS los withdrawn_from_deposit a 0")
print("   2. Recalcularlos basándose en los retiros de inversión aprobados")
print("   3. Recalcularlos basándose en las transferencias de inversión enviadas")
print("   4. Si un usuario retiró/transfirió de más, el exceso se pondrá en el primer depósito")
print()
response = input("¿Deseas continuar? (escribe 'SI' para confirmar): ")

if response.upper() != 'SI':
    print("\n❌ Operación cancelada por el usuario.")
    exit()

print("\n" + "=" * 80)
print("INICIANDO PROCESO...")
print("=" * 80 + "\n")

# Usar una transacción atómica para todo el proceso
with transaction.atomic():
    
    # PASO 1: Resetear todos los withdrawn_from_deposit a 0
    print("📊 PASO 1: Reseteando todos los withdrawn_from_deposit a 0...")
    all_deposits = InvestmentPlanTransaction.objects.all()
    total_deposits = all_deposits.count()
    
    all_deposits.update(withdrawn_from_deposit=0)
    print(f"   ✅ {total_deposits} depósitos reseteados a 0\n")
    
    # PASO 2: Procesar cada usuario con inversión
    print("📊 PASO 2: Procesando retiros y transferencias por usuario...")
    user_investments = UserInvestment.objects.filter(status=True).select_related('user')
    
    total_users = 0
    users_with_withdrawals = 0
    users_with_transfers = 0
    users_with_excess = 0
    
    for user_investment in user_investments:
        user = user_investment.user
        total_users += 1
        
        # Obtener todos los retiros de inversión aprobados y pendientes de este usuario
        withdrawals = Withdrawal.objects.filter(
            user=user,
            type=WithdrawalType.INVESTMENT,
            status__in=[TransactionStatus.APPROVED, TransactionStatus.PENDING]
        ).order_by('date')  # Ordenar por fecha para procesarlos en orden cronológico
        
        # Obtener todas las transferencias de inversión enviadas por este usuario
        transfers = UserTransfer.objects.filter(
            sender=user,
            transfer_type=UserTransfer.TransferType.INVESTMENT
        ).order_by('timestamp')  # Ordenar por fecha
        
        if not withdrawals.exists() and not transfers.exists():
            continue  # Este usuario no tiene retiros ni transferencias de inversión
        
        if withdrawals.exists():
            users_with_withdrawals += 1
        if transfers.exists():
            users_with_transfers += 1
            
        print(f"\n   Usuario: {user.username} (ID: {user.id})")
        print(f"   {'─' * 70}")
        
        # Obtener depósitos del usuario ordenados por fecha (del más antiguo al más reciente)
        deposits = user_investment.investments.filter(
            status=TransactionStatus.APPROVED
        ).order_by('date')
        
        if not deposits.exists():
            print(f"      ⚠️  No tiene depósitos aprobados, pero tiene retiros/transferencias!")
            continue
        
        # Crear una lista combinada de retiros y transferencias ordenada por fecha
        combined_operations = []
        
        for withdrawal in withdrawals:
            combined_operations.append({
                'type': 'RETIRO',
                'id': withdrawal.id,
                'amount': withdrawal.amount,
                'date': withdrawal.date
            })
        
        for transfer in transfers:
            combined_operations.append({
                'type': 'TRANSFERENCIA',
                'id': transfer.id,
                'amount': transfer.amount,
                'date': transfer.timestamp
            })
        
        # Ordenar todas las operaciones por fecha
        combined_operations.sort(key=lambda x: x['date'])
        
        # Procesar cada operación (retiro o transferencia)
        for operation in combined_operations:
            amount_to_distribute = operation['amount']
            op_type = operation['type']
            op_id = operation['id']
            op_date = operation['date'].strftime('%Y-%m-%d')
            
            print(f"      {op_type} #{op_id}: ${amount_to_distribute:,.2f} - {op_date}")
            
            # Distribuir el monto entre los depósitos
            for deposit in deposits:
                if amount_to_distribute <= 0:
                    break  # Ya distribuimos todo
                
                # Calcular cuánto podemos añadir a este depósito
                available_to_add = deposit.amount - deposit.withdrawn_from_deposit
                
                if available_to_add > 0:
                    # Este depósito todavía puede recibir retiros/transferencias
                    amount_from_this_deposit = min(amount_to_distribute, available_to_add)
                    deposit.withdrawn_from_deposit += amount_from_this_deposit
                    amount_to_distribute -= amount_from_this_deposit
                    deposit.save()
            
            # Si todavía queda monto por distribuir, significa que retiró/transfirió de más
            if amount_to_distribute > 0:
                # Meter el exceso en el primer depósito
                first_deposit = deposits.first()
                print(f"         ⚠️  EXCESO: ${amount_to_distribute:,.2f} - Se añade al primer depósito")
                first_deposit.withdrawn_from_deposit += amount_to_distribute
                first_deposit.save()
                users_with_excess += 1
        
        # Calcular totales para verificación
        total_withdrawn_from_deposits = sum(d.withdrawn_from_deposit for d in deposits)
        total_withdrawals_amount = sum(w.amount for w in withdrawals)
        total_transfers_amount = sum(t.amount for t in transfers)
        total_operations = total_withdrawals_amount + total_transfers_amount
        
        print(f"      Total retirado (withdrawals): ${total_withdrawals_amount:,.2f}")
        print(f"      Total transferido (transfers): ${total_transfers_amount:,.2f}")
        print(f"      Total operaciones: ${total_operations:,.2f}")
        print(f"      Total en depósitos (withdrawn_from_deposit): ${total_withdrawn_from_deposits:,.2f}")
        
        if total_withdrawn_from_deposits == total_operations:
            print(f"      ✅ Coinciden perfectamente")
        else:
            print(f"      ⚠️  Diferencia: ${abs(total_withdrawn_from_deposits - total_operations):,.2f}")

# Resumen final
print("\n\n" + "=" * 80)
print("PROCESO COMPLETADO")
print("=" * 80)
print(f"Total de usuarios con inversión: {total_users}")
print(f"Usuarios con retiros de inversión: {users_with_withdrawals}")
print(f"Usuarios con transferencias de inversión: {users_with_transfers}")
print(f"Usuarios que retiraron/transfirieron de más: {users_with_excess}")
print("=" * 80)
print("\n✅ Todos los withdrawn_from_deposit han sido recalculados")
print("   basándose en los retiros y transferencias de inversión.\n")
