from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WithdrawalViewset

router = DefaultRouter()

router.register("withdrawals",WithdrawalViewset, basename="withdrawals")


urlpatterns = [
    path("", include(router.urls))
]
