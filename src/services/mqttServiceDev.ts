import React from 'react';
import mqtt from '@taoqf/react-native-mqtt';
import info from '../utils/info';

function mqttServiceDev(topic:string, message:string) {
    info('mqtt', 'Starting MQTT Service');

    var client = mqtt.connect('mqtt://192.168.0.108');
    client.subscribe('kfjskwje332')

    client.on('message', (topic, payload) => {
        alert([topic, payload].join(': '));
        client.end();
    })

    client.publish('kfjskwje332', 'Oi, tudo bem!');
}

export default mqttServiceDev;