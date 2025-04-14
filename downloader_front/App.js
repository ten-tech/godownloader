// App.js
import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DownloadScreen from './screens/DownloadScreen';
import VideoScreen from './screens/VideoScreen';
import Header from './components/Header';
import { logToFile, readLogs } from './utils/logService.web';

const Stack = createNativeStackNavigator();

export default function App() {
  const [mode, setMode] = useState('download'); // 'download' ou 'convert'

  useEffect(() => {
    logToFile('App has started');

    readLogs()
      .then((logs) => {
        console.log('📄 Logs:', logs);
        if (logs) {
          Alert.alert('Logs du démarrage', logs.slice(-300));
        }
      })
      .catch((err) => {
        console.error('Erreur lecture logs :', err);
      });
  }, []);

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Header currentMode={mode} onModeChange={setMode} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} mode={mode} />}
          </Stack.Screen>
          <Stack.Screen name="Video" component={VideoScreen} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}
