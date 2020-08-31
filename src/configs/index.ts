import React from 'react';

const config = {
    name: 'Danilo',
    locale: 'pt-br',
    speechOptions: {
        'pitch': 1,
        'rate': 1,
    },
    voiceApi: {
        key: 'AIzaSyCA5DIUidjFMQlpjmF8SrXQMWs1x1f9CWQ'
    },
    witApi: {
        baseURL: 'https://api.wit.ai',
        headers: {
            Authorization: 'Bearer PG4WVUCICSUSXDDKHF76RXPPOOMMOR2V'
        },
        v: '20200728',
    }
}

export default config;