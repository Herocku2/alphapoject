from django.urls import path, include
from .views import CreateUserTransferView, FindUserView, UserTransferHistoryView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register('history', UserTransferHistoryView, basename='user-transfer-history')

urlpatterns = [
    path('create/', CreateUserTransferView.as_view(), name='create-user-transfer'),
    path('find/', FindUserView.as_view(), name='find-user'),
    path("", include(router.urls))
    
]