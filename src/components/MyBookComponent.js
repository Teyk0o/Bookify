import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import colors from "../../colors";

/**
 * @typedef {Object} MyBookComponentProps
 * @property {string} title - The title of the book.
 * @property {string} author - The author of the book.
 * @property {string} [coverUrl] - The cover URL of the book.
 * @property {string} [testID] - Test ID for testing.
 */

/**
 * @param {MyBookComponentProps} props
 */
export function MyBookComponent({
                                    title = 'Lorem ipsum',
                                    author = 'Lorem ipsum',
                                    coverUrl,
                                    testID,
                                }) {
    return (
        <View style={styles.root} testID={testID ?? '4:63'}>
            <Image source={{ uri: coverUrl || 'https://placehold.co/85x138' }} style={styles.bookCover} />
            <View style={styles.frame5}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.author}>{author}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'column',
        padding: 10,
        width: 150,
        overflow: 'hidden',
    },
    bookCover: {
        width: 130,
        height: 195,
        borderRadius: 8
    },
    frame5: {
        flexDirection: 'column',
        alignItems: 'left',
        marginTop: 5,
    },
    title: {
        color: 'rgba(0, 0, 0, 1)',
        fontFamily: 'Roboto Mono',
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 16,
        textAlign: 'left',
    },
    author: {
        color: colors.secondary,
        fontFamily: 'Roboto Mono',
        fontSize: 10,
        fontWeight: '700',
        lineHeight: 16,
        textAlign: 'left',
    },
});
