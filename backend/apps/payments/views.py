from rest_framework.viewsets import ReadOnlyModelViewSet
from .serializers import  PasivePaymentSerializer, DirectPaymentSerializer
from .models import DirectPayment, PasivePayment
from apps.core.paginators import BasicPaginationResponse
from django.db.models.functions import TruncMonth
from django.db.models import Sum, ExpressionWrapper, F, DecimalField
from decimal import Decimal
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

class DirectPaymentsViewset(ReadOnlyModelViewSet):
    
    serializer_class = DirectPaymentSerializer
    pagination_class = BasicPaginationResponse
    
    def get_queryset(self):
        return DirectPayment.objects.filter(user=self.request.user).order_by("-date")
    
class PasivePaymentsViewset(ReadOnlyModelViewSet):
    
    serializer_class = PasivePaymentSerializer
    pagination_class = BasicPaginationResponse
    
    def get_queryset(self):
        return PasivePayment.objects.filter(user=self.request.user).order_by("-date")
    
    

class UserMonthlyEarningsAPIView(APIView):
    """
    Suma los porcentajes de rendimiento de cada pago individual,
    agrupado por mes para un año específico.
    """
    def get(self, request, year):
        try:
            year = int(year)
        except ValueError:
            return Response(
                {"error": "El año debe ser un número válido."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Expresión para calcular el porcentaje de cada pago
        percentage_expression = ExpressionWrapper(
            (F('amount') * 100) / F('current_investment_amount'),
            output_field=DecimalField()
        )

        # Filtra, agrupa por mes, y luego SUMA los porcentajes calculados
        earnings_query = PasivePayment.objects.filter(
            user=request.user,
            date__year=year,
            current_investment_amount__gt=0  # Evita división por cero
        ).annotate(
            month=TruncMonth('date')
        ).values(
            'month'
        ).annotate(
            # Aquí está el cambio: Sum() en lugar de Avg() o la lógica anterior
            summed_percentage=Sum(percentage_expression)
        ).order_by('month')

        earnings_dict = {
            item['month'].month: item['summed_percentage']
            for item in earnings_query
        }

        month_names = {
            1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril",
            5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto",
            9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
        }
        
        chart_data = []
        for month_num in range(1, 13):
            chart_data.append({
                "month": month_names[month_num],
                "summed_percentage": earnings_dict.get(month_num, 0)
            })

        return Response(chart_data, status=status.HTTP_200_OK)