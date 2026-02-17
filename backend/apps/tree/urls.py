from django.urls import path, include
from .views import GetUnilevelTree, GetReferrals
from rest_framework import routers

router = routers.DefaultRouter()

router.register("get-referrals", GetReferrals, basename="referrals")


urlpatterns = [
    path("get-binary-tree/", GetUnilevelTree.as_view(), name="binary-tree"),
    path("", include(router.urls))   
]
