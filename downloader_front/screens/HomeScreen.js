import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, ScrollView, Picker } from 'react-native';
import colors from '../theme/colors'; // Import du thème
import * as Progress from 'react-native-progress'; // Import de la bibliothèque pour la barre de progression

export default function HomeScreen({ navigation, mode }) {

  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [downloads, setDownloads] = useState([]);

  // Paramètres de téléchargement
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('720p');
  const [canDownload, setCanDownload] = useState(false);
  const [progress, setProgress] = useState(0);  // Progression du téléchargement
  const [isDownloading, setIsDownloading] = useState(false);  // État pour savoir si on est en téléchargement

  // Fonction pour analyser le lien et détecter la plateforme
  const handleAnalyze = () => {
    if (!url.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un lien.');
      return;
    }

    // Détection des plateformes vidéo
    let platform = '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      platform = 'YouTube';
    } else if (url.includes('instagram.com')) {
      platform = 'Instagram';
    } else if (url.includes('tiktok.com')) {
      platform = 'TikTok';
    } else if (url.includes('facebook.com')) {
      platform = 'Facebook';
    } else if (url.includes('snapchat.com')) {
      platform = 'Snapchat';
    } else {
      Alert.alert('Lien invalide', 'Ce lien ne correspond à aucune plateforme prise en charge.');
      return;
    }

    setVideoInfo({
      title: `Vidéo provenant de ${platform}`,
      thumbnail: 'https://via.placeholder.com/320x180.png', // Placeholder pour la miniature
      url: url, // Ajout de l'URL de la vidéo analysée
      platform: platform
    });

    setCanDownload(false); // Initialiser à false car on n'a pas encore sélectionné les options de téléchargement
  };

  const handleDownload = () => {
    if (!videoInfo) {
      Alert.alert('Erreur', 'Aucune vidéo à télécharger.');
      return;
    }

    if (!format || !quality) {
      Alert.alert('Erreur', 'Veuillez sélectionner un format et une qualité avant de télécharger.');
      return;
    }

    // Simulation de téléchargement avec progression
    setIsDownloading(true);
    setProgress(0); // Réinitialiser la barre de progression
    let downloadProgress = 0;

    const interval = setInterval(() => {
      if (downloadProgress >= 1) {
        clearInterval(interval);
        // Fin du téléchargement simulé
        setIsDownloading(false);
        setDownloads([
          {
            title: videoInfo.title,
            thumbnail: videoInfo.thumbnail,
            url: videoInfo.url,
            format: format,
            quality: quality,
            status: 'Téléchargement terminé'
          },
          ...downloads
        ]);
        Alert.alert('Téléchargement', `Téléchargement de "${videoInfo.title}" (${format}, ${quality}) terminé.`);
      } else {
        downloadProgress += 0.1;  // Incrémente la progression
        setProgress(downloadProgress);
      }
    }, 500);  // La barre de progression se met à jour toutes les 500ms
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {mode === 'download' ? '🎬 Téléchargement de Vidéos' : '🎞️ Convertisseur de Vidéos'}
      </Text>

      <Text style={styles.subtitle}>
        {mode === 'download'
          ? 'Collez un lien, choisissez la qualité, et en un clic la vidéo est à vous.'
          : 'Transformez n’importe quelle vidéo en un format parfait, rapidement et simplement.'}
      </Text>


      {/* Champ de lien */}
      <TextInput
        style={styles.input}
        placeholder="Entrez un lien vidéo..."
        placeholderTextColor={colors.muted}
        value={url}
        onChangeText={setUrl}
      />

      {/* Bouton Analyser */}
      <TouchableOpacity style={styles.button} onPress={handleAnalyze}>
        <Text style={styles.buttonText}>Analyser</Text>
      </TouchableOpacity>

      {/* Résultat de l’analyse */}
      {videoInfo && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>{videoInfo.title}</Text>
          <Image source={{ uri: videoInfo.thumbnail }} style={styles.thumbnail} />

          {/* Sélectionner le format */}
          <View style={styles.selector}>
            <Text style={styles.selectorLabel}>Format :</Text>
            <Picker
              selectedValue={format}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setFormat(itemValue);
                setCanDownload(true);  // Rendre le bouton actif après avoir sélectionné le format
              }}
            >
              <Picker.Item label="MP4" value="mp4" />
              <Picker.Item label="AVI" value="avi" />
              <Picker.Item label="MOV" value="mov" />
            </Picker>
          </View>

          {/* Sélectionner la qualité */}
          <View style={styles.selector}>
            <Text style={styles.selectorLabel}>Qualité :</Text>
            <Picker
              selectedValue={quality}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setQuality(itemValue);
                setCanDownload(true);  // Rendre le bouton actif après avoir sélectionné la qualité
              }}
            >
              <Picker.Item label="360p" value="360p" />
              <Picker.Item label="480p" value="480p" />
              <Picker.Item label="720p" value="720p" />
              <Picker.Item label="1080p" value="1080p" />
            </Picker>
          </View>

          {/* Bouton de téléchargement */}
          {canDownload && !isDownloading && (
            <TouchableOpacity
              style={[styles.button, { marginTop: 15 }]}
              onPress={handleDownload}
            >
              <Text style={styles.buttonText}>Télécharger</Text>
            </TouchableOpacity>
          )}

          {/* Affichage de la barre de progression si téléchargement est en cours */}
          {isDownloading && (
            <View style={styles.progressContainer}>
              <Progress.Bar
                progress={progress}
                width={350}
                height={20}
                borderRadius={8}
                color={colors.primary}
                unfilledColor={colors.muted}
                borderWidth={1}
                indeterminate={false}
              />
              <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            </View>
          )}
        </View>
      )}

      {/* Liste des vidéos téléchargées */}
      {downloads.length > 0 && (
        <View style={styles.downloadList}>
          <Text style={styles.downloadListTitle}>Téléchargements :</Text>
          {downloads.map((download, index) => (
            <View key={index} style={styles.downloadItem}>
              <Image source={{ uri: download.thumbnail }} style={styles.thumbnail} />
              <View style={styles.downloadInfo}>
                <Text style={styles.downloadTitle}>{download.title}</Text>
                <Text style={styles.downloadStatus}>
                  {download.status} ({download.format}, {download.quality})
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: colors.text,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  result: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  thumbnail: {
    width: 320,
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  selector: {
    width: '100%',
    marginBottom: 15,
  },
  selectorLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 10,
    backgroundColor: colors.background,
    fontSize: 16,
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.primary,
  },
  downloadList: {
    marginTop: 40,
  },
  downloadListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  downloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  downloadInfo: {
    marginLeft: 15,
  },
  downloadTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  downloadStatus: {
    fontSize: 14,
    color: colors.muted,
  },
});
