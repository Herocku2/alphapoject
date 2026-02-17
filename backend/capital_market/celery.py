import os
from celery import Celery


RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_USER = os.getenv("RABBITMQ_DEFAULT_USER", "user")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_DEFAULT_PASS", "password")

PRODUCTION = os.getenv('PRODUCTION', False)

# Set the default Django settings module for the 'celery' program.
if not PRODUCTION:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'capital_market.settings.base')
    app = Celery('capital_market',
            broker=f'amqp://localhost',)
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'capital_market.settings.production')
    app = Celery('capital_market',
            broker=f'amqp://{RABBITMQ_USER}:{RABBITMQ_PASSWORD}@{RABBITMQ_HOST}',)

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a CELERY_ prefix.
app.conf.broker_transport_options = {'visibility_timeout': 43200}
app.conf.result_backend_transport_options = {'visibility_timeout': 43200}
app.conf.visibility_timeout = 43200

app.config_from_object('django.conf:settings', namespace='CELERY')



# Load task modules from all registered Django apps.
app.autodiscover_tasks()