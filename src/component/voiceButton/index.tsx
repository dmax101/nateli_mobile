import React from 'react';
import { View, Image } from 'react-native';
import * as Speech from 'expo-speech'; // Talk to user lib
import * as Permissions from 'expo-permissions';

import { BorderlessButton } from 'react-native-gesture-handler';

import api from '../../services/api';

import voiceButtonIcon from '../../../assets/icon/voiceButton.png';

import styles from './styles';

function VoiceButton() {
    async function alertIfMicrophonePermissionDisabledAsync() {
        const { status } = await Permissions.getAsync(Permissions.AUDIO_RECORDING);
        if (status !== 'granted') {
          alert('Uso do microfone não permitido');
        }
    }

    function handleVoiceCommand() {
        console.log("Pressionou o Botão!");
        alertIfMicrophonePermissionDisabledAsync()

        try {
            const options = {
                'language': 'pt-BR',
                'pitch': 1,
                'rate': 1,
            }
            Speech.speak('Olá, Meu nome é Nateli', options);
            
        } catch (error) {
            console.log('Algo deu errado!');
            console.log(error);
        }

         api.get('/message?v=20200811&q=ligar luz da garagem')
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
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