import hmac
import hashlib
import requests
import os

def coinpayments_api_call(command, payload):
    api_key = os.getenv("COINPAYMENTS_API_KEY")
    api_secret = os.getenv("COINPAYMENTS_API_SECRET")
    
    url = 'https://www.coinpayments.net/api.php'

    # Añadir parámetros comunes al payload
    payload['version'] = '1'
    payload['key'] = api_key
    payload['cmd'] = command
    payload['format'] = 'json'

    # Ordenar los parámetros por clave y crear la cadena de datos para el POST
    post_data = '&'.join(f"{key}={value}" for key, value in sorted(payload.items()))
    
    # Crear la firma HMAC
    signature = hmac.new(api_secret.encode('utf-8'), post_data.encode('utf-8'), hashlib.sha512).hexdigest()

    # Configurar headers
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'HMAC': signature
    }

    # Enviar la solicitud POST
    response = requests.post(url, headers=headers, data=post_data)
    return response.json()

from apps.core.models import GeneralSettings
import os
import requests

PAYMENTS_USER = os.getenv("PAYMENTS_USER","smartsolutions")
PAYMENTS_PASSWORD = os.getenv("PAYMENTS_PASSWORD",'cmG-u?"S4q1L90-')

def create_payment_request(value, receiver_wallet='', token='USDT.BEP20'):
    g_settings = GeneralSettings.objects.first()
    
    if not receiver_wallet:
        receiver_wallet = g_settings.receiver_wallet

    response_login = requests.post("https://payments.tctplus.xyz/api/auth/token/", {
                    "username": PAYMENTS_USER,
                    "password": PAYMENTS_PASSWORD
                }).json()
    
    response_payment = requests.post("https://payments.tctplus.xyz/api/business/payment/", {
                    "amount": value,
                    "network": g_settings.network_payments,
                    "token": token,
                    "receiver_wallet": receiver_wallet,
                    "offset_amount":g_settings.offset_amount_payments
                }, headers={
                    "Authorization": f"Bearer {response_login['access']}"}).json()
    return response_payment

def verify_payment_request(paymentId):
    response_login = requests.post("https://payments.tctplus.xyz/api/auth/token/", {
                    "username": PAYMENTS_USER,
                    "password": PAYMENTS_PASSWORD
                }).json()
    response_payment = requests.post(f"https://payments.tctplus.xyz/api/business/payment/{paymentId}/verify-payment/", {}, headers={
                    "Authorization": f"Bearer {response_login['access']}"}).json()

    return response_payment