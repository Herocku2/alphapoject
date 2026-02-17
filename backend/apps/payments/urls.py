from rest_framework.routers import DefaultRouter
from .views import DirectPaymentsViewset, PasivePaymentsViewset, UserMonthlyEarningsAPIView
from django.urls import path, include

router = DefaultRouter()

router.register("direct-payments", DirectPaymentsViewset, basename="direct-payments")
router.register("pasive-payments", PasivePaymentsViewset, basename="pasive-payments")

urlpatterns = [
    path('earnings/<int:year>/', UserMonthlyEarningsAPIView.as_view(), name='user-monthly-earnings'),
    path("", include(router.urls), name="payments"),
    
]
