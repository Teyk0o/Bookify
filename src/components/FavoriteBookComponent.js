import React from 'react';
import { Dimensions } from 'react-native';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from "../../colors"; // Assuming you're using expo

const { width } = Dimensions.get('window');
const componentWidth = width * 0.8;

/**
 * @typedef {Object} FavoriteBookComponentProps
 * @property {string} title - The title of the book.
 * @property {string} author - The author of the book.
 * @property {string} description - The description of the book.
 * @property {string} [coverUrl] - The cover URL of the book.
 * @property {string} [testID] - Test ID for testing.
 */

/**
 * @param {FavoriteBookComponentProps} props
 */
export function FavoriteBookComponent({
                                          title = 'Lorem ipsum',
                                          author = 'Lorem ipsum',
                                          description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...',
                                          coverUrl,
                                          testID,
                                      }) {
    return (
        <View style={styles.root} testID={testID ?? '2:39'}>
            <Image source={{ uri: coverUrl || 'https://placehold.co/85x138' }} style={styles.bookCover} />
            <View style={styles.frame3}>
                <View style={styles.titleAndAuthor}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.author}>{author}</Text>
                </View>
                <Text style={styles.description} numberOfLines={10} ellipsizeMode="tail">{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'flex-start',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(234, 234, 234, 1)',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        maxWidth: componentWidth,
        minWidth: componentWidth,
        maxHeight: 230,
        marginRight: 13,
        overflow: 'hidden',
    },
    bookCover: {
        width: 130,
        height: 195,
        borderRadius: 8
    },
    titleAndAuthor: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    title: {
        color: 'rgba(0, 0, 0, 1)',
        fontFamily: 'Roboto Mono',
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 16,
        textAlign: 'left',
    },
    author: {
        color: colors.secondary,
        fontFamily: 'Roboto Mono',
        fontSize: 11,
        fontWeight: '700',
        lineHeight: 16,
        textAlign: 'left',
    },
    frame3: {
        flexDirection: 'column',
        marginLeft: 10,
        flex: 1,
    },
    description: {
        color: 'rgb(0,0,0)',
        fontFamily: 'Roboto Mono',
        fontSize: 10,
        fontWeight: '500',
        lineHeight: 14,
        marginBottom: 10,
        flexShrink: 1,
        width: '100%',
    },
    showMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    showMoreText: {
        color: colors.secondary,
        fontFamily: 'Roboto Mono',
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 16,
        marginRight: 5,
    },
});
