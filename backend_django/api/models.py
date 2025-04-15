from django.db import models # type: ignore
from django.contrib.auth.models import AbstractUser # type: ignore

# === Utilisateur ===
class User(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

# === Historique de téléchargement ===
class DownloadHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='downloads')
    url = models.URLField()
    title = models.CharField(max_length=255)
    format = models.CharField(max_length=20)
    quality = models.CharField(max_length=20)
    date = models.DateTimeField(auto_now_add=True)
    thumbnail_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.format} ({self.quality})"

# === Historique de conversion ===
class ConversionHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversions')
    input_format = models.CharField(max_length=20)
    output_format = models.CharField(max_length=20)
    file_size = models.IntegerField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.input_format} -> {self.output_format}"

# === Logs Serveur ===
class ServerLog(models.Model):
    LOG_TYPES = (
        ('INFO', 'Info'),
        ('ERROR', 'Erreur'),
        ('WARNING', 'Avertissement'),
    )
    type = models.CharField(max_length=10, choices=LOG_TYPES)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.type}] {self.timestamp}"
