from django.urls import path, include
from .views import InvestmentView, VerifyPaymentView, InvestmentTransactionHistoryView, InvestmentDashboardAPIView, ReinvestmentView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("history", InvestmentTransactionHistoryView, basename="history")

urlpatterns = [
    path("create-investment-payment/", InvestmentView.as_view(), name="invest-amount"),
    path("verify-investment-amount/", VerifyPaymentView.as_view(), name="verify-amount"),
    path("investment-panel/", InvestmentDashboardAPIView.as_view(), name="investment-panel"),
    path('reinvest/', ReinvestmentView.as_view(), name="reinvest"), # <-- NUEVA URL
    path('', include(router.urls))
]
