from rest_framework.views import APIView
from rest_framework import response, status
from apps.investment_plans.models import UserInvestment
from django.db.models import Sum
from django.utils import timezone
from apps.tree.models import Referr

class DashboardDetailsView(APIView):
    
    def get(self, request):
        user_investment = UserInvestment.objects.filter(user=request.user).last()
        response_data = {
            "investment_amount": 0,
            "total_profit": 0,
            "daily": 0,
            "direct_users": 0,
            "indirect_users": 0,
            "daily_payment": 0,
            "days_profit": 0,
            "daily_percentage": 0,
            "withdrawable_date": None,
            "chart_data": {"labels": [], "series": []},
            "investment_progress": 0
        }
        today = timezone.now().astimezone(tz=timezone.get_current_timezone())
        if user_investment:
            response_data['investment_amount'] = user_investment.total_investment_amount
            response_data['total_profit'] = user_investment.pasive_payments.all().aggregate(value=Sum("amount")).get('value') or 0
            response_data['daily_payment'] = user_investment.pasive_payments.filter(date__month=today.month).aggregate(value=Sum("amount")).get("value") 
            response_data['withdrawable_date'] = user_investment.activation_date
            response_data['days_profit'] = (today - user_investment.activation_date).days
            if response_data['daily_payment']:
                if response_data['investment_amount'] > 0:
                    response_data['daily_percentage'] = response_data['daily_payment']  * 100  / response_data['investment_amount']
                else:
                    response_data['daily_percentage'] = 0
                    
            if user_investment.min_time_to_withdraw :
                response_data["investment_progress"] = (1 - ((abs(user_investment.min_time_to_withdraw - today)).days / 365)) * 100
        
        # Loop through the last 30 days
            
        # for i in range(15):
        #     date = today - timezone.timedelta(days=14-i)  # Start from 30 days ago and move forward
        #     pasive_payment = PasivePayment.objects.filter(user=request.user,date__date=date).last()
        #     if pasive_payment:
        #         response_data['chart_data']['series'].append(pasive_payment.balance_investment_pasive)
        #     else:
        #         response_data['chart_data']['series'].append(0)
                
        #     response_data['chart_data']['labels'].append(date.strftime('%m-%d'))
            
        # direct_users = UnilevelTree.objects.get(user=request.user).get_children()
        # response_data['indirect_users'] = UnilevelTree.objects.get(user=request.user).get_descendants().exclude(user__in=
        #   
        direct_users = Referr.objects.filter(user=request.user)
        response_data['direct_users'] = direct_users.count()
        return response.Response(data=response_data, status=status.HTTP_200_OK)
    
