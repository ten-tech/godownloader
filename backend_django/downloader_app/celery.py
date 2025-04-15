import os
from celery import Celery

# Définit les paramètres Django pour Celery
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "downloader_app.settings")

app = Celery('downloader_app')

# Charge la config depuis settings.py (CELERY_*)
app.config_from_object('django.conf:settings', namespace='CELERY')

# Recherche les tâches dans tous les fichiers tasks.py
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
