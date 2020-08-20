import React from 'react';
import { View, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';

import VoiceButton from '../../component/voiceButton';

import config from '../../configs';

import getGreeting from '../../utils/getGreeting';
import getDate from "../../utils/getDate";

import cloudIcon from '../../../assets/icon/cloudIcon.png';
import styles from './styles';

function Landing() {
    const { date, month, weekDay } = getDate();

    return (
        <ScrollView style={styles.container}>
            
            <BlurView intensity={80} style={styles.mainCard}>
                <View style={styles.header}>
                    <View style={styles.right}>
                        <Text style={styles.greetings}>{ getGreeting() }</Text>
                        <Text style={styles.name}>{ config.name }</Text>
                        <Text style={styles.serverStatusText}>Online</Text>
                    </View>
                    <View style={styles.left}>
                        <Text style={styles.day}>{date}</Text>
                        <Text style={styles.month}>{month}</Text>
                        <Text style={styles.weekDay}>{weekDay}</Text>
                    </View>
                </View>

                <BlurView intensity={80} style={styles.weatherBar}>
                    <Image source={cloudIcon} style={styles.cloudIcon} />
                    <Text style={styles.weatherText}>16º, Pouco Nublado - Pouso Alegre - Feriado</Text>
                </BlurView>

                <View style={styles.statusBlock}>
                    <Text style={styles.statusTextLabel}>Status</Text>
                    <Text style={styles.statusTextDisplay}>Ouvindo...</Text>
                </View>

            </BlurView>

            <View style={styles.bottonBarGroup}>
                <BlurView style={styles.bottonBar}>
                    <VoiceButton/>
                </BlurView>
            </View>
        </ScrollView>
    )
}

export default Landing;