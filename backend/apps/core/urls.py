from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardDetailsView

router = DefaultRouter()


urlpatterns = [
    path("auth/", include("apps.authentication.urls")),
    path("plans/", include("apps.investment_plans.urls")),
    path("tree/", include("apps.tree.urls")),
    path("payments/", include("apps.payments.urls")),
    path("withdrawals/", include("apps.withdrawals.urls")),
    path("core/dashboard/", DashboardDetailsView.as_view(), name="dashboard"),
    path("transfers/", include("apps.transfers.urls")),
    path("core/", include(router.urls)),
   
]
