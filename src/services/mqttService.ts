import React from 'react';
import config from '../configs';
import info from '../utils/info';

const mqtt = require('../lib/mqtt/mqtt.js')


function mqttService(topic:string, message:string) {

    const mqttConfig = config.mqttApiDev;
    const url = mqttConfig.baseURL + ':' + mqttConfig.port;

    const client = mqtt.connect(url)

    client.on('connect', () => {
        client.subscribe(topic, (err: any) => {
            if (!err) {
                client.publish(topic, message)
                info('mqtt', `Published in ${topic} the message ${message}`)
            } else {
                info('mqtt', 'Error', err)
            }
        })
    })
}

export default mqttService;