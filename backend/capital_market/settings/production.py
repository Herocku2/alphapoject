from .base import *

BACKEND_DOMAIN = os.getenv('BACKEND_DOMAIN')
BACKEND_DOMAIN_2 = os.getenv('BACKEND_DOMAIN_2')
FRONTEND_DOMAIN = os.getenv("FRONTEND_DOMAIN")
FRONTEND_DOMAIN_2 = os.getenv("FRONTEND_DOMAIN_2")
FRONTEND_DOMAIN_3 = os.getenv("FRONTEND_DOMAIN_3")

from celery import Celery
DEBUG = False
# Lee las variables de entorno cargadas en el sistema
DB_NAME = os.getenv('MYSQL_DATABASE')
DB_USER = os.getenv('MYSQL_USER')
DB_HOST = os.getenv('MYSQL_HOST')
DB_PASSWORD = os.getenv('MYSQL_PASSWORD')
DB_PORT = os.getenv('DB_PORT')
SECRET_KEY = os.getenv('SECRET_KEY')


DATABASES = {
    'default': {
        'NAME':DB_NAME,
        'ENGINE':   'django.db.backends.mysql',
        'USER': DB_USER,
        'PASSWORD':DB_PASSWORD,
        'HOST': DB_HOST,  # Ej: 'escritura.servidor.com'
        'PORT': DB_PORT,
    },
}

ALLOWED_HOSTS = [BACKEND_DOMAIN, BACKEND_DOMAIN_2, FRONTEND_DOMAIN, FRONTEND_DOMAIN_2]

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [
    "https://"+BACKEND_DOMAIN, "https://"+BACKEND_DOMAIN_2, 
    "https://"+FRONTEND_DOMAIN, "https://"+FRONTEND_DOMAIN_2,
    "https://"+FRONTEND_DOMAIN_3
]

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

CSRF_TRUSTED_ORIGINS = [
    "http://"+BACKEND_DOMAIN,
]

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

STATIC_ROOT = os.path.join(BASE_DIR, '../static')
STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, '../media')
MEDIA_URL = '/media/'

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_USER = os.getenv("RABBITMQ_DEFAULT_USER", "user")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_DEFAULT_PASS", "password")

CELERY_BROKER_URL = f'amqp://{RABBITMQ_USER}:{RABBITMQ_PASSWORD}@{RABBITMQ_HOST}:5672'

# Set the default Django settings module for the 'celery' program.
app = Celery('capital_market',
            broker=f'amqp://{RABBITMQ_USER}:{RABBITMQ_PASSWORD}@{RABBITMQ_HOST}',)

app.conf.broker_transport_options = {'visibility_timeout': 43200}
app.conf.result_backend_transport_options = {'visibility_timeout': 43200}
app.conf.visibility_timeout = 43200

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a CELERY_ prefix.
# settings.py o configuración de Celery
CELERY_TASK_DEFAULT_QUEUE = 'celery'
CELERY_TASK_QUEUES = {
    'celery': {
        'exchange': 'celery',
        'exchange_type': 'direct',
        'durable': True,  # Asegura que la cola sea durable
    },
}
CELERY_TASK_TIME_LIMIT = 30 * 60

app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

# EMAIL_BACKEND = 'django_mailjet.backends.MailjetBackend'
# MAILJET_API_KEY = os.getenv("MAILJET_API_KEY")
# MAILJET_API_SECRET = os.getenv("MAILJET_API_SECRET")

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.mailgun.org'  # Reemplaza por el host real (por ejemplo: smtp.gmail.com, smtp.office365.com)
EMAIL_PORT = 587  # o 465 si usas SSL
EMAIL_USE_TLS = True  # Usa True para TLS, False si usas SSL
# EMAIL_USE_SSL = True  # Si usas SSL en vez de TLS, activa esto y desactiva TLS

EMAIL_HOST_USER = 'admin@lc.smartsolution.name'  # Tu usuario SMTP
EMAIL_HOST_PASSWORD = 'TztxcmHmjj5Ug80Wfx'
DEFAULT_FROM_EMAIL = 'Smart Solution. Notificaciones <admin@lc.smartsolution.name>'
