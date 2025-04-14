# 🎩 GoDownloader — App de Téléchargement & Conversion de Vidéos

**GoDownloader** est une application mobile React Native permettant d’analyser, télécharger et convertir des vidéos à partir de liens (YouTube, etc.). Le backend Django s'occupe du traitement serveur : récupération des métadonnées, téléchargement, conversion, logs et gestion des utilisateurs.

---

## 📱 Frontend

### Stack

- React Native (Expo)
- React Navigation
- Axios
- Custom Theming (fonts, colors)
- Analyse du lien **côté client** pour éviter les appels backend inutiles

### Fonctionnalités

- 🔍 Analyse de lien (via regex)
- 🎮 Affichage infos vidéo (titre, image, durée, formats)
- 📅 Téléchargement au format & qualité choisis
- 🔁 Conversion (MP4 → MP3 ou autre)
- 📜 Historique des téléchargements
- 🔐 Authentification après action
- 📀 Stockage local de l'historique
- 📊 UX moderne avec Header sticky + thème dynamique

### Structure

```
downloader_front/
├── components/       # Header, boutons, éléments UI
├── screens/          # Home, Download, Video
├── theme/            # Fonts, Colors, Spacing
├── utils/            # Helpers pour analyse d'URL, API
├── App.js            # Entrée principale
├── app.json          # Config Expo
```

---

## 🛠️ Backend

### Stack

- Django 5
- Django Rest Framework (DRF)
- Django SimpleJWT (authentification)
- PostgreSQL (recommandé)
- yt-dlp (téléchargement vidéo)
- ffmpeg (conversion)
- Logging intégré
- REST API sécurisée
- Prévu pour dockerisation

### Fonctionnalités

- 📦 Analyse de lien (titre, thumbnail, formats, qualité)
- 🚀 Téléchargement rapide avec yt-dlp
- 🔁 Conversion via ffmpeg
- 🔐 Authentification par token (JWT)
- 🕵️‍♂️ Logging d’activité serveur
- 🧾 Historique par utilisateur

### Structure

```
backend_django/
├── api/
│   ├── views.py        # Logique API
│   ├── urls.py         # Routes API
│   ├── models.py       # Utilisateur, Historique, Logs
│   ├── serializers.py  # DRF serializers
│   └── utils/          # yt_service.py, convert.py
├── downloader_app/
│   ├── settings.py     # Configuration Django
│   ├── urls.py         # Routes principales
├── manage.py
```

---

## 🔗 API Reference

| Endpoint              | Méthode    | Auth | Description                                               |
| --------------------- | ---------- | ---- | --------------------------------------------------------- |
| `/api/analyze/`       | `POST`     | ❌    | Envoie une URL → retourne `title`, `thumbnail`, `formats` |
| `/api/download/`      | `POST`     | ✅    | Téléchargement vidéo via `yt-dlp`                         |
| `/api/convert/`       | `POST`     | ✅    | Conversion de fichier (mp4 → mp3 etc.)                    |
| `/api/history/`       | `GET`      | ✅    | Récupère l’historique utilisateur                         |
| `/api/logs/`          | `POST/GET` | ✅    | Ajout ou récupération de logs                             |
| `/api/auth/login/`    | `POST`     | ❌    | Récupération token JWT                                    |
| `/api/auth/register/` | `POST`     | ❌    | Création d’un compte                                      |
| `/api/auth/refresh/`  | `POST`     | ❌    | Rafraîchir access token                                   |

---

## 🔑 Authentification

- Basée sur JWT (via SimpleJWT)
- Token `access` + `refresh`
- Obligatoire **après analyse**, avant **téléchargement/conversion**
- Les actions sont stockées en base et liées à l'utilisateur

---

## 🗃️ Modèles principaux (DB)

### `User`

Hérite de `AbstractUser`.

### `DownloadHistory`

```python
user = ForeignKey(User)
url = CharField
title = CharField
format = CharField
date = DateTimeField
thumbnail_url = URLField
```

### `ConversionHistory`

```python
user = ForeignKey(User)
input_format = CharField
output_format = CharField
date = DateTimeField
file_size = IntegerField
```

### `ServerLog`

```python
type = CharField (INFO, ERROR...)
message = TextField
timestamp = DateTimeField
```

---

## 🐳 Dockerisation (prévue)

- `Dockerfile` pour le backend
- Docker image incluant `yt-dlp`, `ffmpeg`, `python`
- Possibilité d’ajouter nginx + gunicorn + volume S3

---

## ⚙️ ToDo Backend

- &#x20;Setup Django + DRF
- Auth JWT
- yt-dlp wrapper (analyze, download)
- ffmpeg wrapper (convert)
- Modèles et base PostgreSQL
- Historique + Logs
- Dockerfile
- Tests unitaires

---

## ✨ Exemples d'utilisation (Frontend → Backend)

### Analyse d'une URL

```http
POST /api/analyze/
Content-Type: application/json

{
  "url": "https://youtube.com/watch?v=abc123"
}
```

**Réponse**

```json
{
  "title": "Nom de la vidéo",
  "thumbnail": "https://img.youtube.com/...",
  "platform": "YouTube",
  "formats": ["mp4", "webm"],
  "qualities": ["720p", "1080p"]
}
```

---

## 📬 Contact / Dev

**Créé par :** Ténénan

**Nom de l’app :** `GoDownloader`

---

