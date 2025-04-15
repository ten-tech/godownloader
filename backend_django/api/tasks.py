import yt_dlp
import os
from celery import shared_task # type: ignore
from .models import DownloadHistory
from django.contrib.auth import get_user_model # type: ignore

User = get_user_model()

@shared_task
def download_video_task(user_id, url, format):
    try:
        user = User.objects.get(id=user_id)
        ydl_opts = {
            'format': 'bestaudio/best' if format == 'mp3' else 'bestvideo+bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
            }] if format == 'mp3' else [],
            'outtmpl': f'downloads/{user.username}_%(title)s.%(ext)s',
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            title = info.get('title', '')
            thumbnail = info.get('thumbnail', '')
            quality = info.get('format', '')

            DownloadHistory.objects.create(
                user=user,
                url=url,
                title=title,
                format=format,
                quality=quality,
                thumbnail_url=thumbnail,
            )
        return f"{title} téléchargé avec succès !"

    except Exception as e:
        return f"Erreur: {str(e)}"
