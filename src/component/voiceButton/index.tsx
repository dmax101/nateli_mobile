import React from 'react';
import { View, Image } from 'react-native';

import { BorderlessButton } from 'react-native-gesture-handler';

import voiceButtonIcon from '../../../assets/icon/voiceButton.png';

import styles from './styles';

function VoiceButton() {
    function handleVoiceCommand() {
        console.log("Pressionou o Botão!");
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