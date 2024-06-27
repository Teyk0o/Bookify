import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RandomBookScreen() {
    return (
        <View style={styles.container}>
            <Text>Random Book Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
