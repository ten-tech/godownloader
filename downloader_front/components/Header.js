import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Ajout de MaterialIcons

import { useTheme } from '../theme';

export default function Header({ onModeChange }) {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Bouton retour */}
      {canGoBack ? (
        <TouchableOpacity style={styles.sideButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
      ) : (
        <View style={styles.sideButton} />
      )}

      {/* Titre centré */}
      <Text style={[styles.title, { color: colors.white, fontFamily: fonts.bold }]}>
        GoDownloader
      </Text>


      {/* Actions : Téléchargement & Convertisseur */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onModeChange('download')}
        >
          <Ionicons name="download-outline" size={22} color={colors.white} />
          <Text style={styles.actionText}>Télécharger</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onModeChange('convert')}
        >
          <MaterialIcons name="transform" size={22} color={colors.white} />
          <Text style={styles.actionText}>Convertir</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    height: 90,
  },
  sideButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginBottom: 0,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    alignItems: 'center',
    marginLeft: 10,
  },
  actionText: {
    fontSize: 12,
    color: 'white',
    marginTop: 2,
  },
});

