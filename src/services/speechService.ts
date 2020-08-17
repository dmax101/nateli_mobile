import React from 'react';
import * as Speech from 'expo-speech'; // Talk to user lib
import config from '../configs';


function Speak(sentence: string) {
    const { locale, speechOptions } = config;
    
    const options = {
        language: locale,
        pitch: speechOptions.pitch,
        rate: speechOptions.rate
    }

    Speech.speak(sentence, options)
    console.log(sentence);
    
}

export default Speak;