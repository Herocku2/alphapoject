import json as reader
import os
import django

production = os.getenv('PRODUCTION', False)
if not production:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mercenario_backend.settings.base')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mercenario_backend.settings.production')
    
django.setup()

from apps.core.models import GeneralSettings
from django.contrib.auth import get_user_model
from apps.tree.models import Referr, UnilevelTree

def init_db():
    javier = get_user_model().objects.create_superuser(username="javier", password="caballero2002", email="javier@gmail.com",
                                              )
    
    root = get_user_model().objects.create(username="root", password="root", email="root@gmail.com",)
    
    Referr.objects.create(user=root, referred=root,)
    
    Referr(user=root, referred=javier, )
    
    GeneralSettings.objects.create(root_user=root, level_payments=[5,2,1], currency_coin_payments="LTCT",
                                   minimum_investment_amount=500)