import React, { useState } from 'react';
import { Image, View, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

import info from '../../utils/info';

import voiceButtonIcon from '../../../assets/icon/voiceButton.png';
import styles from './styles';
import speechToText from '../../services/speechToText';
import apiTest from '../../services/apiTest';
import api from '../../services/api';

function VoiceButton() {

    const [soundURI, setSoundURI] = useState('');
    const [soundFile, setSoundFile] = useState('');

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
            extension: '.m4a',
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
        },
        ios: {
            extension: '.wav',
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
            sampleRate: 16000,
            numberOfChannels: 1,
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
        const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        
        info('permissions', `verifing permition status: ${status}`)

        if(status === 'granted') {
            return true;
        } else {
            return false;
        }
    }

    async function startRecording() {
        const recording = new Audio.Recording();
        try {
            await recording.prepareToRecordAsync(recordingSettings);
            await recording.startAsync().then(() => {
                info('recording', 'Starting recording');
            });
            
            setTimeout(() => {
                try {
                    info('recording', 'Stopping recording');
                    recording.stopAndUnloadAsync().then(async () => {

                        const information = await FileSystem.getInfoAsync(String(recording.getURI()));

                        info('recording', `File Info: ${JSON.stringify(information)}`)
                        setSoundURI(String(information.uri));

                        await FileSystem.readAsStringAsync(soundURI,
                            {
                                "encoding": FileSystem.EncodingType.Base64,
                                //"length": length,
                                //"position": 0,
                            })
                            .then(async (file) => {
                                info('file system', 'Reading complete');
                                
                                await speechToText(file).then((resp) => {
                                    console.log(resp);
                                    
                                }).catch((error) => {
                                    info('google api', `Error: ${error}`)
                                });
                                
                            })
                            .catch((error) => {
                                info('file system', 'Something get wrong', error);
                            });                 
                    });
                    
                } catch (error) {
                    info('recording', 'Error on recording');
                }
            }, 6000);


        } catch (error) {
            
        }
    }

    async function verifyRecording() {           
    }

    async function handleVoiceCommandOn() {
        info('event', 'Button pressed in')

        if(verifyMicrophonePermission()) {
            startRecording();
        } else {
            info('permitions', 'Ouve algum erro ao solicitar permissão para uso do microfone')
        }
    }
    
    async function handleVoiceCommandOff() {
        info('event', 'Button pressed off');

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