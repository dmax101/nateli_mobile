import React from 'react';
import { View, Image, Linking } from 'react-native';
import * as Permissions from 'expo-permissions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';

import config from '../../configs';

import Speak from '../../services/speechService';
import getGreeting from '../../utils/getGreeting';
import api from '../../services/api';

import voiceButtonIcon from '../../../assets/icon/voiceButton.png';

import styles from './styles';
import info from '../../utils/info';

function VoiceButton() {
    const greeting = getGreeting();

    Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
    })
        
    

    /**
     * That function verify the microphone permission from device
     * 
     * @returns return true for the permission granted and falso to deny
     */
    async function verifyMicrophonePermission() {
        const { status } = await Permissions.getAsync(Permissions.AUDIO_RECORDING);
        
        info('permissions', 'verifing permition status')

        while (status !== 'granted') {
            
            try {
                await Audio.getPermissionsAsync();
                info('permition', 'Permition granted')
            } catch (error) {
                alert('Uso do microfone não permitido, permitir em configurações do sistema');
                info('permissions', 'Opening settings', error)
                
                Linking.openURL('app-settings:');
                
                return false;
            }
        }
        
        info('permition', 'Permition granted')
        return true;
    }

    async function initiateRecording() {
        const recording = new Audio.Recording();
        try {
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            setTimeout(() => {
                if(!recording._isDoneRecording) {
                    info('recording','Recording done!')
                } else {
                    info('recording','Recording yet!')
                }


                recording.stopAndUnloadAsync().then(() => {
                    const soundObject = recording.createNewLoadedSoundAsync();

                    console.log(soundObject);
                });
                info('recording', 'Success');
            }, 5000);
        } catch (error) {
            info('recording', 'Error on recording', error);
        }
    }

    async function verifyRecording() {
                
    }

    async function sendToSpeechToTextApi() {
        info('google api', 'Enviando para a api do google')
    }

    async function handleVoiceCommandOn() {
        info('event', 'Button pressed in')

        if(verifyMicrophonePermission()) {
            initiateRecording()
        } else {
            info('permitions', 'Ouve algum erro ao solicitar permissão para uso do microfone')
        }
        


        /*
        console.log("Pressionou o Botão!");


        
        var message = greeting + ' ' + config.name + ', meu nome é Nateli, como posso ajudar';
        Speak(message);

        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        
        if((await (await recording.getStatusAsync()).isRecording)) {
            await recording.stopAndUnloadAsync();
            console.log('Parando gravação atual');
        }
        
        try {
            if (!(await recording.getStatusAsync()).canRecord) {
                console.log('Não é possível gravar ainda!');
            } else if((await recording.getStatusAsync()).isRecording) {
                recording.stopAndUnloadAsync();
                console.log('Parando gravação atual');
            } else {
                // You are now recording!
                await recording.startAsync();

                console.log(recording.getStatusAsync());
                console.log('Gravação em andamento');
            }
            

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

    async function handleVoiceCommandOff() {
        info('event', 'Button pressed Off')


        
        //verifyRecording()
        //await recording.stopAndUnloadAsync();
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPressIn={handleVoiceCommandOn} onPressOut={handleVoiceCommandOff}>
                <Image source={voiceButtonIcon} resizeMode="contain"/>
            </TouchableOpacity>
        </View>
    )
}

export default VoiceButton;