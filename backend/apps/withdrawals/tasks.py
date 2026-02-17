from celery import shared_task
from .models import SecretCode, Withdrawal, TransactionStatus
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string

@shared_task
def send_secret_withdrawal_code(secret_code_id):
    secret_code = SecretCode.objects.get(pk=secret_code_id)
    
    # 2. Asunto del correo
    subject = "Código de Confirmación para tu Retiro!"
    
    # 3. Contexto para la plantilla HTML
    context = {
        'user_name': secret_code.user.first_name or secret_code.user.username,
        'code': secret_code.code,
        'date': secret_code.created_date,
        'message': "Haz recibido este correo con tu código de seguridad para realizar tu retiro en la plataforma de Smart Solution"
    }

    # Renderizar la plantilla HTML a un string
    html_message = render_to_string('withdrawals/secret_code.html', context)
    
    # El correo se enviará como HTML, por lo que el mensaje de texto plano puede ser simple.
    plain_message = f"Hola {context['user_name']},\nCódigo secreto para realizar retiro!"

    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL, # Configurado en settings.py
        recipient_list=[secret_code.user.email],
        html_message=html_message,
        fail_silently=False,
    )
    
    

@shared_task
def send_withdrawal_made_details(withdrawal_id):
    withdrawal = Withdrawal.objects.get(pk=withdrawal_id)
    if withdrawal.status == TransactionStatus.APPROVED:
        # 2. Asunto del correo
        subject = "Confirmación de Retiro en Smart Solution!"
        
        # 3. Contexto para la plantilla HTML
        context = {
            'user_name': withdrawal.user.first_name or withdrawal.user.username,
            'amount': withdrawal.amount,
            'date': withdrawal.date,
            'id': withdrawal.payment_link
        }

        # Renderizar la plantilla HTML a un string
        html_message = render_to_string('withdrawals/withdrawal_made.html', context)
        
        # El correo se enviará como HTML, por lo que el mensaje de texto plano puede ser simple.
        plain_message = f"Hola {context['user_name']},\nConfirmación de Retiro en Smart Solution!"

        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL, # Configurado en settings.py
            recipient_list=[withdrawal.user.email],
            html_message=html_message,
            fail_silently=False,
        )