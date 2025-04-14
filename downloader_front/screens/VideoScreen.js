import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Picker, StyleSheet } from 'react-native';
import Header from '../components/Header';

const VideoScreen = ({ route, navigation }) => {
  const { videoInfo } = route.params;
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('720p');

  const handleDownload = () => {
    // Simuler un téléchargement
    navigation.navigate('Downloads');
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>{videoInfo.title}</Text>
      <Picker
        selectedValue={format}
        onValueChange={(itemValue) => setFormat(itemValue)}
      >
        <Picker.Item label="MP4" value="mp4" />
        <Picker.Item label="AVI" value="avi" />
        <Picker.Item label="MOV" value="mov" />
      </Picker>
      <Picker
        selectedValue={quality}
        onValueChange={(itemValue) => setQuality(itemValue)}
      >
        <Picker.Item label="360p" value="360p" />
        <Picker.Item label="720p" value="720p" />
        <Picker.Item label="1080p" value="1080p" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleDownload}>
        <Text style={styles.buttonText}>Télécharger</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default VideoScreen;
