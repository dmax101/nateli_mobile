import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { AppLoading } from 'expo';

import { View, ImageBackground } from 'react-native';

import Landing from './src/pages/Landing';

import img from './assets/bkgnd.png';
import splashImg from './assets/splash.png';

// Import das Fontes
import {
  useFonts,
  OpenSansCondensed_300Light,
  OpenSansCondensed_700Bold
} from '@expo-google-fonts/open-sans-condensed';

import { NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';

import styles from './styles';

export default function App() {
  let [fontsLoaded] = useFonts ({
    OpenSansCondensed_300Light,
    OpenSansCondensed_700Bold,
    NotoSansJP_400Regular,
    NotoSansJP_700Bold
  })

  if (!fontsLoaded) {
    return (
      <AppLoading>
        <ImageBackground source={img} style={styles.image}/>
        <ImageBackground source={splashImg} style={styles.image}/>
      </AppLoading>
    ) 
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