from datetime import timedelta
from rest_framework import generics, status # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.permissions import AllowAny, IsAuthenticated # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView # type: ignore
from django.contrib.auth import get_user_model # type: ignore

from rest_framework.views import APIView # type: ignore
import os, yt_dlp, uuid, logging

from .tasks import download_video_task
from django.utils import timezone # type: ignore

from .serializers import RegisterSerializer, CustomTokenSerializer, DownloadHistorySerializer
from .models import DownloadHistory

User = get_user_model()

# Enregistrement utilisateur
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

# Login (JWT)
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer

# Téléchargement de vidéo
class VideoDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        url = request.data.get('url')
        format_choice = request.data.get('format', 'mp4')
        quality = request.data.get('quality', 'best')

        if not url:
            return Response({'error': 'URL requise'}, status=status.HTTP_400_BAD_REQUEST)

        # Créer un répertoire de téléchargement s’il n’existe pas
        download_dir = 'downloads'
        os.makedirs(download_dir, exist_ok=True)

        filename = f"{uuid.uuid4()}.{format_choice}"
        filepath = os.path.join(download_dir, filename)

        ydl_opts = {
            'format': quality,
            'outtmpl': filepath,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)

            # Enregistrement dans l’historique
            download = DownloadHistory.objects.create(
                user=request.user,
                url=url,
                title=info.get('title'),
                format=format_choice,
                quality=quality,
                thumbnail_url=info.get('thumbnail', '')
            )

            serializer = DownloadHistorySerializer(download)
            return Response({
                'message': 'Téléchargement réussi ✅',
                'file_path': filepath,
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Téléchargement d'audio
class AudioDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        url = request.data.get('url')
        quality = request.data.get('quality', 'bestaudio')

        if not url:
            return Response({'error': 'URL requise'}, status=status.HTTP_400_BAD_REQUEST)

        download_dir = 'downloads'
        os.makedirs(download_dir, exist_ok=True)

        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(download_dir, filename)

        ydl_opts = {
            'format': quality,
            'outtmpl': filepath,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)

            # Enregistrement dans l’historique de téléchargement
            download = DownloadHistory.objects.create(
                user=request.user,
                url=url,
                title=info.get('title'),
                format='mp3',
                quality=quality,
                thumbnail_url=info.get('thumbnail', '')
            )

            serializer = DownloadHistorySerializer(download)
            return Response({
                'message': 'Téléchargement audio réussi 🎶',
                'file_path': filepath,
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Création du logger
logger = logging.getLogger(__name__)

class DownloadRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        url = request.data.get('url')
        format = request.data.get('format', 'mp4')  # Format par défaut
        user = request.user

        if not url:
            logger.warning(f"URL manquante pour la requête de téléchargement pour l'utilisateur {user.email}.")
            return Response({"detail": "L'URL est requise."}, status=400)

        # Limitation par utilisateur (5 téléchargements / heure)
        one_hour_ago = timezone.now() - timedelta(hours=1)
        recent_downloads = DownloadHistory.objects.filter(user=user, date__gte=one_hour_ago).count()

        if recent_downloads >= 5:
            logger.warning(f"L'utilisateur {user.email} a atteint la limite de téléchargement (5/heure).")
            return Response({"detail": "Limite de téléchargement atteinte. Réessaye plus tard."}, status=429)

        try:
            # Lancer la tâche asynchrone de téléchargement
            download_video_task.delay(user.id, url, format)
            logger.info(f"Téléchargement en arrière-plan démarré pour l'utilisateur {user.email}, URL: {url}, Format: {format}.")
            return Response({"detail": f"Téléchargement en arrière-plan démarré pour {format}."})

        except Exception as e:
            # Gestion des erreurs si la tâche échoue
            logger.error(f"Erreur lors de l'initiation du téléchargement pour l'utilisateur {user.email}: {str(e)}")
            return Response({"detail": "Erreur lors du démarrage du téléchargement."}, status=500)