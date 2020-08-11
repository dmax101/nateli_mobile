import React from 'react';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';

import styles from './styles';

function Landing() {
    return (
        <View style={styles.container}>
            
            <BlurView intensity={100} style={styles.mainCard}>
                <BlurView style={styles.header}>
                    <View style={styles.right}></View>
                </View>

                <Text style={styles.text}>
                    Boa noite,
                </Text>
            </BlurView>
            
        </View>
    )
}

export default Landing;