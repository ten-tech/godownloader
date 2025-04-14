// screens/DownloadScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../theme/colors'; // Thème global

export default function DownloadScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📥 Page de Téléchargement</Text>
      <Text style={styles.subtitle}>Collez un lien pour démarrer le téléchargement</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Simuler un téléchargement de vidéo
          navigation.navigate('Video');
        }}
      >
        <Text style={styles.buttonText}>Télécharger une vidéo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
