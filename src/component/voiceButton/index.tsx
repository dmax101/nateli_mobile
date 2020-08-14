import React from 'react';
import { View, Image } from 'react-native';
import Voice from "@react-native-community/voice";

import { BorderlessButton } from 'react-native-gesture-handler';

import api from '../../services/api';

import voiceButtonIcon from '../../../assets/icon/voiceButton.png';

import styles from './styles';

function VoiceButton() {
    function handleVoiceCommand() {
        console.log("Pressionou o Botão!");

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