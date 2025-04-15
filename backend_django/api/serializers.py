import logging
from rest_framework import serializers # type: ignore
from .models import User, DownloadHistory, ConversionHistory, ServerLog
from django.contrib.auth import get_user_model # type: ignore
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore
from rest_framework_simplejwt.exceptions import AuthenticationFailed # type: ignore

# Création d'un logger
logger = logging.getLogger(__name__)

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        logger.info(f"Utilisateur créé: {user.email}")
        return user

class CustomTokenSerializer(TokenObtainPairSerializer):
    # On remplace username par email ici
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email is None or password is None:
            logger.warning("Email ou mot de passe manquant dans la requête.")
            raise serializers.ValidationError("Email et mot de passe sont requis.")

        logger.info(f"Tentative de connexion pour l'email: {email}")

        # Recherche de l'utilisateur avec l'email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            logger.warning(f"Échec de l'authentification pour l'email: {email} (utilisateur non trouvé)")
            raise AuthenticationFailed("Email ou mot de passe incorrect.")

        # Vérification du mot de passe
        if not user.check_password(password):
            logger.warning(f"Échec de l'authentification pour l'email: {email} (mot de passe incorrect)")
            raise AuthenticationFailed("Email ou mot de passe incorrect.")

        logger.info(f"Authentification réussie pour l'utilisateur: {user.email}")

        # Passe les informations au serializer de JWT
        data = super().validate({
            "username": user.username,  # on passe le username à SimpleJWT
            "password": password
        })

        data["email"] = user.email
        data["username"] = user.username
        return data

    def to_internal_value(self, data):
        # Permet de bypass le champ username par défaut
        return {
            'email': data.get('email'),
            'password': data.get('password')
        }

class DownloadHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DownloadHistory
        fields = '__all__'

class ConversionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversionHistory
        fields = '__all__'

class ServerLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServerLog
        fields = '__all__'
