import React from 'react';
import config from '../configs';
import info from '../utils/info';
import Paho from "../lib/mqttjs";

function mqttService(tpc:string, msg:string) {
    info('mqtt', 'Starting mqtt service')
    
    info('mqtt', `Trying to send message "${msg}" on topic "${tpc}".`)

    const mqttConf = config.mqttApiDev;

    const location = {
        hostname: mqttConf.host,
        port: mqttConf.port
    }

    // Create a client instance
    try {
        var client = new Paho.Client(location.hostname, Number(location.port), '/mqtt', 'ClientId');
        info('mqtt', `Starting mqtt connection on ${location.hostname}:${location.port}`)
        info('mqtt', `Connection status: ${client.isConnected()}`)
        console.log(client);
    } catch (error) {
        info('mqtt', 'Error', error)
    }

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    const us = {
        //timeout: 60,
        //userName: mqttConf.user,
        //password: mqttConf.password,
        //useSSL: true,
        onSuccess: onConnect,
        onFailure: onConnectionLost,
        //hosts: 'ws://broker.hivemq.com',
        //ports: 1883,
        //reconnect: true,
        //mqttVersion: 3,
        //mqttVersionExplicit: true
      };
    client.connect(us);

    // called when the client connects

    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        info('mqtt', 'Connection established')
        try {
            client.subscribe(tpc);
        } catch (error) {
            info('mqtt', 'Impossible to connect', error);
        }
        const message = new Paho.Message(msg);
        message.destinationName = tpc;
        client.send(message);

        info('mqtt', `Sending message "${msg}" on topic ${tpc}.`)
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject: { errorCode: number; errorMessage: string; }) {
        if (responseObject.errorCode !== 0) {
            info('mqtt', 'Lost the connection', responseObject.errorMessage)
        }
    }

    // called when a message arrives
    function onMessageArrived(message: { payloadString: string; }) {
        info('mqtt', `Message Arrived: ${message.payloadString}`);
    }
}



export default mqttService;