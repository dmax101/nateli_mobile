import React from 'react';
import info from '../utils/info'
import config from '../configs';
import googleApi from './googleApi';

async function speechToText(file: string) {
    info('google api', 'Enviando para a api do google')
    console.log(file);

    const destination = '/speech:recognize?key=' + config.voiceApi.key;
    try {
        await googleApi.post(destination,
            {
            "config": {
                    "encoding": "LINEAR16",
                    "sampleRateHertz": 16000,
                    "languageCode": "pt-br"
            },
                "audio": {
                    "content": file,
                }
        }).then((resp) => {
            info('google api', `recebendo dados: ${JSON.stringify(resp.data)}`);
            return JSON.stringify(resp.data)
        });
    } catch (error) {
        info('reading file', 'Cant send the recording', error)
        return "Error"
    }
}

export default speechToText;