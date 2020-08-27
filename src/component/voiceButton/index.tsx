import React, { useState } from 'react';
import { View, Image, Linking } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { TouchableOpacity } from 'react-native-gesture-handler';

import info from '../../utils/info';
import googleApi from '../../services/googleApi';
import Speak from '../../services/speechService';
import getGreeting from '../../utils/getGreeting';
import api from '../../services/api';

import config from '../../configs';

import voiceButtonIcon from '../../../assets/icon/voiceButton.png';
import styles from './styles';

const [sound, setSound] = useState(null);
const [uri, setURI] = useState(null);

function VoiceButton() {
    const greeting = getGreeting();

    Speak(greeting);

    Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
    })

    const recordingSettings = {
        android: {
            extension: ".m4a",
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
        },
        ios: {
            extension: ".m4a",
            outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
        },
    };

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
            await recording.prepareToRecordAsync(recordingSettings);
            await recording.startAsync();

            setTimeout(() => {
                if(!recording._isDoneRecording) {
                    info('recording','Recording done!')
                } else {
                    info('recording','Recording yet!')
                }

                recording.stopAndUnloadAsync()
                    .then(async () => {
                        info('recording', 'Success');
                    })
                    .then(async () => {
                        try {
                            const information = await FileSystem.getInfoAsync(recording.getURI());
                            const length = information.size;
                            info('recording', `File Info: ${JSON.stringify(information)}`)
                            setURI(recording.getURI());

                            const file = await FileSystem.readAsStringAsync(uri,
                                {
                                    "encoding": FileSystem.EncodingType.Base64,
                                    //"length": length,
                                    //"position": 0,
                                })
                                .then(async () => {
                                    info('file system', 'Reading complete');
                                    setSound(file)
                                    await sendToSpeechToTextApi(sound)
                                        .then((response) => {
                                            Speak(response);
                                        });
                                })
                                .catch((error) => {
                                    info('file system', 'Something get wrong', error);
                                });

                                
                                
                            
                        } catch (error) {
                            console.log(error);
                        }
                    });
                
            }, 5000);

        } catch (error) {
            info('recording', 'Error on recording', error);
        }
    }

    async function verifyRecording() {           
    }

    async function sendToSpeechToTextApi(file) {
        info('google api', 'Enviando para a api do google')

        const destination = '/speech:recognize?key=' + config.voiceApi.key;

        console.log(typeof(file));
        

        try {
            googleApi.post(destination,
                {
                "config": {
                        "encoding": "FLAC",
                        "sampleRateHertz": 16000,
                        "languageCode": "pt-br"
                },
                    "audio": {
                        "content": file,
                    }
            }).then((response: { data: any; }) => {
                info('google api', `recebendo dados: ${JSON.stringify(response.data)}`);
                return(response.data)
            });
        } catch (error) {
            info('reading file', 'Cant read the file', error)
        }
        

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

        const information = await FileSystem.getInfoAsync(uri);
        info('playback', `File Info: ${JSON.stringify(information)}`)

        try {
            const { sound: soundObject, status } = await Audio.Sound.createAsync(
              {
                  uri: uri
              },
              { shouldPlay: true }
              
              ).then(() => {
                  console.log("aqui");
                  console.log(status);
                  
                  console.log("aqui12");
            });
            // Your sound is playing!
          } catch (error) {
            // An error occurred!
          }
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