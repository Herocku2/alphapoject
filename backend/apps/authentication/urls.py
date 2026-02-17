from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserDataView, TokenObtainPairView, RegisterView, SendCodeView, ResetPasswordView, UpdatePasswordView, EmailVerificationView

app_name = "authentication"

urlpatterns = [
    # otras rutas de la API
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("user/change-password/", UpdatePasswordView.as_view(), name="change-password"),
    path('user/', UserDataView.as_view(), name="user-data"),
    path('register/<str:ref_code>/', RegisterView.as_view(), name='register'),
    path('reset-password/send/', SendCodeView.as_view(), name='send_code'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('verify-email/', EmailVerificationView.as_view(), name='email-verify'),
    
]
