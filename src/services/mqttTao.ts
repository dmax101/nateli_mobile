import React from 'react';
import mqtt from '@taoqf/react-native-mqtt';
import config from '../configs';
import info from '../utils/info';

function mqttTao(topic:string, message:string) {

    info('mqtt', 'Starting mqtt service')
    
    info('mqtt', `Trying to send message "${message}" on topic "${topic}".`)

    const mqttBroker = config.mqttApiDev3;

    const clientOptions: mqtt.IClientOptions = {
        //port: mqttBroker.port,
        //host: mqttBroker.host,
        //hostname: mqttBroker.host,
        //path: '',
        protocol: "mqtt",
        //clientId: 'NateliMobile',
        //protocolId: 'MQTT',
        //clean: true,
        //username: mqttBroker.user,
        //password: mqttBroker.password,
        // servers: [{
        //     host: mqttBroker.host,
        //     port: mqttBroker.port,
        //     protocol: "mqtt",
        // }]
    }
    
    //const uri = mqttBroker.protocol + '://' + mqttBroker.host + ':'+ mqttBroker.port;
    const uri = mqttBroker.host + ':'+ mqttBroker.port;
    info('mqtt', `Connecting to: ${uri}`);

    const client = mqtt.connect(clientOptions);

    client.on('connect', () => {
        info('mqtt', 'Connected')
        client.subscribe(topic, (err: any) => {
          if (!err) {
            client.publish(topic, message);
          } else {
              info('mqtt', 'Error encontred:', err)
          }
        })
      })
      client.end();
}

export default mqttTao;