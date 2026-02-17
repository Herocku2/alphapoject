from rest_framework import serializers
from .models import Withdrawal, SecretCode, CodeStatuses, WithdrawalMethod
from django.utils.translation import gettext_lazy as _
from apps.core.models import GeneralSettings
from apps.investment_plans.models import UserInvestment, InvestmentPlanTransaction
from apps.transfers.models import UserTransfer
from .choices import WithdrawalType
from decimal import Decimal
from django.db import transaction # Import transaction for atomicity
from apps.investment_plans.choices import TransactionStatus
from django.utils import timezone
from .models import WithdrawalMethod
from apps.core.utils import get_media_file_url

class WithdrawalSerializer(serializers.ModelSerializer):
    
    # used_code = serializers.CharField()  # DISABLED: OTP code no longer required
    user = serializers.CharField(required=False, read_only=True)
    used_code = serializers.CharField(required=False, read_only=True)
    
    class Meta:
        model = Withdrawal
        fields = '__all__'
        
    def to_internal_value(self, data):
        try:
            internal_values = super().to_internal_value(data)
            internal_values['user'] = self.context.get("user")
            user = internal_values['user']
            
            # DISABLED: OTP code validation - no longer required
            # code = data.get("used_code")
            # user = internal_values['user']
            # used_code_obj = SecretCode.objects.get(code=code, user=user,
            #                                     status=CodeStatuses.UNUSED)
            # used_code_obj.status = CodeStatuses.USED
            # used_code_obj.save()
            # internal_values['used_code'] = used_code_obj
            
            if not "method" in internal_values:
                internal_values["method"] = WithdrawalMethod.CRYPTO
                
            if internal_values["method"] == WithdrawalMethod.CRYPTO:
                if not internal_values["wallet_address"]:
                    raise ValueError(_("Please select a valid wallet address."))
            else:
                internal_values.pop("wallet_address")
                if  user.bank_name and  user.bank_name and user.bank_account_number and user.bank_swift_code:
                    internal_values["bank_bank_name"] = user.bank_name
                    internal_values["bank_account_number"] = user.bank_account_number
                    internal_values["bank_country"] = user.bank_country
                    internal_values["bank_swift_code"] = user.bank_swift_code
                else:
                    raise ValueError(_("Full your bank data in your profile to continue."))
            return internal_values
        # DISABLED: No need to catch SecretCode.DoesNotExist anymore
        # except SecretCode.DoesNotExist:
        #     raise ValueError(_("Secret code doesn't exist or already have expired."))
        except Exception as e:
            raise ValueError(e)
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["verbose_type"] = instance.get_type_display()
        representation["verbose_status"] = instance.get_status_display()
        representation["verbose_method"] = instance.get_method_display()
        
        # Add username
        representation["username"] = instance.user.username if instance.user else None
        
        # Add total invested and total withdrawn (investment withdrawals only)
        try:
            from django.db.models import Sum
            
            # Total invested: sum of all approved investment transactions
            user_investment = UserInvestment.objects.filter(user=instance.user).last()
            if user_investment:
                total_invested = user_investment.investments.filter(
                    status=TransactionStatus.APPROVED
                ).aggregate(total=Sum('amount'))['total'] or 0
                representation["total_invested"] = float(total_invested)
            else:
                representation["total_invested"] = 0
            
            # Total withdrawn: sum of ONLY INVESTMENT type approved withdrawals
            total_withdrawn = Withdrawal.objects.filter(
                user=instance.user,
                type=WithdrawalType.INVESTMENT,
                status=TransactionStatus.APPROVED
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            # P2P transfers: sum of INVESTMENT type transfers sent by user
            total_p2p_transfers = UserTransfer.objects.filter(
                sender=instance.user,
                transfer_type=UserTransfer.TransferType.INVESTMENT
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            # Total withdrawn includes both withdrawals and P2P transfers
            representation["total_withdrawn"] = float(total_withdrawn)
            representation["total_p2p_transfers"] = float(total_p2p_transfers)
            
        except Exception as e:
            representation["total_invested"] = 0
            representation["total_withdrawn"] = 0
            representation["total_p2p_transfers"] = 0
        
        if instance.payment_invoice:
            representation["payment_invoice"] = get_media_file_url(instance.payment_invoice.url)
        return representation
    
    def create(self, validated_data):
        # Initial checks (min amount, secret code) remain
        created_obj = super().create(validated_data)

        type = validated_data.get("type")
        user = validated_data.get("user")
        method = validated_data.get("method")
        amount_to_withdraw = Decimal(validated_data.get("amount", 0)) # Use Decimal for calculations
        g_settings = GeneralSettings.objects.first()

        if amount_to_withdraw < g_settings.min_withdrawal_amount:
            raise ValueError(_("Min withdrawal amount is {} USD. Please try again.").format(g_settings.min_withdrawal_amount))

        if method == WithdrawalMethod.FIAT and amount_to_withdraw < g_settings.min_fiat_withdrawable:
            raise ValueError(_("Min FIAT withdrawal amount is {} USD. Please try again.").format(g_settings.min_fiat_withdrawable))

        if type == WithdrawalType.DIRECT:
            # Logic for direct withdrawal from user.balance remains the same
            if amount_to_withdraw > user.balance:
                raise ValueError(_(f"You can't exceed your available balance ${user.balance} USD"))
            user.balance -= amount_to_withdraw
            user.save()
            
        elif type == WithdrawalType.PASIVE:
            
            if amount_to_withdraw  <= user.investment_balance:
                user.investment_balance -= amount_to_withdraw
                user.save()
            else:
                raise ValueError(_(f"No puedes exceder tu disponible de utilidades ${(user.investment_balance)} USD."))
        
                    
            
        elif type == WithdrawalType.INVESTMENT:
            user_investment = UserInvestment.objects.select_for_update().filter(user=user, status=True).first()

            if not user_investment:
                raise ValueError(_("You don't have an active investment to withdraw from."))

            # Calculate total withdrawable from individual eligible deposits
            total_available_from_deposits = user_investment.withdrawable_deposit_amount
            
            
            investment_balance_deposits = total_available_from_deposits
            
                
                
            if amount_to_withdraw > investment_balance_deposits:
                raise ValueError(_(f"Tu retiro de inversión no puede exceder el máximo retirable ${(total_available_from_deposits)} USD."))

            # Start a database transaction to ensure atomicity
            # If anything fails during the loop, all changes are rolled back.
            with transaction.atomic():
                remaining_to_withdraw = amount_to_withdraw

                # Get eligible deposits, ordered by date (oldest first) with lock
                eligible_deposits = user_investment.investments.select_for_update().filter(
                    status=TransactionStatus.APPROVED,
                    is_free=False,
                    available_for_withdrawal_date__lte=timezone.now()
                ).order_by('date') # Order by date to withdraw from oldest first
                
                for deposit in eligible_deposits:
                    # Amount available from this specific deposit
                    available_in_this_deposit = deposit.amount - deposit.withdrawn_from_deposit
                    
                    if remaining_to_withdraw <= 0:
                        break # All requested amount has been covered
                    if available_in_this_deposit <= 0:
                        continue
                    # print(remaining_to_withdraw)
                    
                    if available_in_this_deposit >= remaining_to_withdraw:
                        # This deposit can cover the remaining withdrawal amount
                        deposit.withdrawn_from_deposit += remaining_to_withdraw
                        # user_investment.withdrawn += remaining_to_withdraw # Update total withdrawn on UserInvestment
                        
                        remaining_to_withdraw = Decimal(0)
                    else:
                        # This deposit cannot cover the entire remaining amount, withdraw all from it
                        deposit.withdrawn_from_deposit += available_in_this_deposit
                        # user_investment.withdrawn += available_in_this_deposit # Update total withdrawn on UserInvestment
                        remaining_to_withdraw -= available_in_this_deposit

                    deposit.save() # Save changes to the specific deposit

                    # Deduct from user's investment_balance (if you're still using it for display)
                    # It's better to recalculate user.investment_balance based on actual deposits
                    # or remove it if total_investment_amount and withdrawable_deposit_amount are sufficient.
                    # If user.investment_balance is meant to reflect *total* earnings from all investments,
                    # you might deduct from it, but be careful not to double count with withdrawn_from_deposit.
                    # For this logic, we are managing the deduction at the deposit level.
                    # You might need to re-evaluate what user.investment_balance represents.
                    # For now, let's assume it should also decrease.
                if remaining_to_withdraw > 0:
                    raise ValueError(_("Not enough funds to complete withdrawal."))
                
                user_investment.save() # Save the UserInvestment to update the total 'withdrawn' field

        return created_obj
