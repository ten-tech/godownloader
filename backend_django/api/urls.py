from django.urls import path # type: ignore
from .views import RegisterView, LoginView, VideoDownloadView, AudioDownloadView, DownloadRequestView
from rest_framework_simplejwt.views import TokenRefreshView # type: ignore

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("video/download/", VideoDownloadView.as_view(), name="video_download"),
    path("audio/download/", AudioDownloadView.as_view(), name="audio_download"),
    path("download/", DownloadRequestView.as_view(), name="download"),
]
