import React from 'react';
import config from '../configs';
import info from '../utils/info';
import Paho from "../lib/mqttjs";

function mqttService(tpc:string, msg:string) {
    info('mqtt', 'Starting mqtt service')
    
    info('mqtt', `Trying to send message "${msg}" on topic ${tpc}.`)
    const mqttConf = config.mqttApiDev

    const location = {
        hostname: mqttConf.host,
        port: mqttConf.port
    }

    // Create a client instance
    try {
        //var client = new Paho.Client(location.hostname, Number(location.port), 'Celular');
        var client = new Paho.Client(location.hostname, Number(location.port), 'Celular');
        info('mqtt', 'Starting mqtt connection')
    } catch (error) {
        info('mqtt', 'Error', error)
    }

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    const us = {
        //userName: mqttConf.user,
        //password: mqttConf.password,
        //useSSL: false,
        onSuccess: onConnect,
        onFailure: onConnectionLost,
        //hosts: mqttConf.host,
        //ports: mqttConf.port,
        //reconnect: false,
        //mqttVersion: 3.1,
        //mqttVersionExplicit: true
      };
    client.connect(us);

    
    


    // called when the client connects

    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        info('mqtt', 'Connection established')
        client.subscribe(tpc);
        const message = new Paho.Message(msg);
        message.destinationName = tpc;
        client.send(message);
        info('mqtt', `Send message "${msg}" on topic ${tpc}.`)
        client.unsubscribe(tpc);
        console.log(client.isConnected());
        
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject: { errorCode: number; errorMessage: string; }) {
    if (responseObject.errorCode !== 0) {
        info('mqtt', 'Lost the connection', responseObject.errorMessage)
        //console.log("onConnectionLost:"+responseObject.errorMessage);
    }
    }

    // called when a message arrives
    function onMessageArrived(message: { payloadString: string; }) {
        info('mqtt', 'Message Arrived', message.payloadString);
        //console.log("onMessageArrived:"+message.payloadString);
    }
}

export default mqttService;