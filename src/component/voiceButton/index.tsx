import React from 'react';
import { View, Image, Linking } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';

import config from '../../configs';

import Speak from '../../services/speechService';
import getGreeting from '../../services/getGreeting';
import api from '../../services/api';

import voiceButtonIcon from '../../../assets/icon/voiceButton.png';

import styles from './styles';

function VoiceButton() {
    const greeting = getGreeting();
    
    async function getUserMicrophonePermission() {
        console.log('Pedindo permissão para uso do microfone');
        Audio.getPermissionsAsync();
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    }

    async function alertIfMicrophonePermissionDisabledAsync() {
        const { status } = await Permissions.getAsync(Permissions.AUDIO_RECORDING);
        if (status !== 'granted') {
            getUserMicrophonePermission();
            alert('Uso do microfone não permitido, permitir em configurações do sistema');
            Linking.openURL('app-settings:');
        }
    }

    async function handleVoiceCommand() {
        console.log("Pressionou o Botão!");
        alertIfMicrophonePermissionDisabledAsync()

        try {

            Speak(greeting + ' ' + config.name + ', meu nome é Nateli, como posso ajudar');
            
        } catch (error) {
            console.log('Algo deu errado!');
            console.log(error);
        }

        const recording = new Audio.Recording();

        try {
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            // You are now recording!
          } catch (error) {
            // An error occurred!
            console.log('Não foi possível gravar');
            console.log(error);
            
          }

        /*
        api.get('/message?v=20200811&q=ligar luz da garagem')
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
        */
    }

    return (
        <View style={styles.container}>
            <BorderlessButton onPress={handleVoiceCommand}>
                <Image source={voiceButtonIcon} resizeMode="contain"/>
            </BorderlessButton>
        </View>
    )
}

export default VoiceButton;