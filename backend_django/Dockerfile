# Étape 1 : Utilisation d'une image officielle de Python
FROM python:3.13-alpine

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier le fichier requirements.txt et installer les dépendances
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Étape 4 : Copier tous les fichiers du projet dans le conteneur
COPY . .

# Étape 5 : Exposer le port sur lequel l'application Django fonctionne
EXPOSE 8000

# Étape 6 : Commande pour démarrer l'application Django avec Gunicorn
CMD ["gunicorn", "downloader_app.wsgi:application", "--bind", "0.0.0.0:8000"]
