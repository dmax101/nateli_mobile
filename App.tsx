import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { AppLoading } from 'expo';

import { View, ImageBackground } from 'react-native';

import Landing from './src/pages/Landing';

import img from './assets/bkgnd.png';

// Import das Fontes
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_700Bold
} from '@expo-google-fonts/open-sans';

import styles from './styles';

export default function App() {
  let [fontsLoaded] = useFonts ({
    OpenSans_400Regular,
    OpenSans_700Bold
  })

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <ImageBackground source={img} style={styles.image}/>
        <View style={styles.main}>
          <Landing />
        </View>
      </View>
    );
  }
};