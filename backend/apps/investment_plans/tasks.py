from celery import shared_task
from .models import InvestmentPlanTransaction
from .choices import TransactionStatus
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def expire_payment(payment_id):
    payment = InvestmentPlanTransaction.objects.get(pk=payment_id)
    if payment.status == TransactionStatus.PENDING:
        payment.status = TransactionStatus.EXPIRED
        payment.save()
        return "Expired "+ str(payment_id)
    return "No Expired " + str(payment_id)

@shared_task
def send_deposit_verification_email(deposit_id):
    transaction = InvestmentPlanTransaction.objects.get(pk=deposit_id)

    # 2. Asunto del correo
    subject = "¡Depósito Exitoso! Tu inversión en Smart Solution ya está activa!"
    
    hash = " - "
    if transaction.coinpayments_response.get("information"):
        hash = transaction.coinpayments_response.get("information").get("transaction_hash")
    
    # 3. Contexto para la plantilla HTML
    context = {
        'user_name': transaction.current_investment.user.first_name or transaction.current_investment.user.username,
        'amount': transaction.amount,
        'date': transaction.date,
        'hash':hash
    }

    # Renderizar la plantilla HTML a un string
    html_message = render_to_string('investment_plans/deposit_verified.html', context)
    
    # El correo se enviará como HTML, por lo que el mensaje de texto plano puede ser simple.
    plain_message = f"Hola {context['user_name']},\nTu depósito ha sido confirmado!"

    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL, # Configurado en settings.py
        recipient_list=[transaction.current_investment.user.email],
        html_message=html_message,
        fail_silently=False,
    )