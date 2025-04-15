# Utilise une image Node officielle
FROM node:20-slim

# Mise à jour et installation des dépendances système nécessaires
RUN apt-get update --fix-missing && \
    apt-get install -y watchman git curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Crée le dossier de travail
WORKDIR /app

# Copie les fichiers nécessaires pour npm
COPY package.json package-lock.json ./

# Installe les dépendances du projet
RUN npm install

# Installe Expo CLI globalement
#RUN npm install -g expo-cli

# Copie le reste du code dans l’image
COPY . .

# Expose les ports pour Expo :
# - 19000 pour Expo Go (mobile)
# - 19001 pour debugging
# - 19002 pour l’interface web
# - 19006 pour Expo Web
EXPOSE 19000 19001 19002 19006

# Lancement flexible via ENTRYPOINT
CMD ["npx", "expo", "start", "--tunnel"]
