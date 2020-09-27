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
    },
    mqttApi: {
        host: 'csilab-broker.inatel.br',
        port: 8883,
        user: 'csilab',
        password: 'WhoAmI#2020',
        protocol: 'mqtt'
    },
    mqttApiDev: {
        host: 'broker.hivemq.com',
        port: 8000,
        user: '',
        password: '',
        protocol: 'ws'
    },
    mqttApiDev2: {
        host: '192.168.0.108',
        port: 1883,
        user: '',
        password: '',
        protocol: 'mqtt'
    },
    mqttApiDev3: {
        host: 'test.mosquitto.org',
        port: 1883,
        user: '',
        password: '',
        protocol: 'mqtt'
    },
    mqttApiDev4: {
        host: 'mqtt.eclipse.org',
        port: 1883,
        user: '',
        password: '',
        protocol: 'mqtt'
    }
}

export default config;