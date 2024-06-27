import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import colors from "../../colors";

const getCountryFlagEmoji = (countryCode) => {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
};

const filterDescription = (description) => {
    if (!description) return 'Aucune description communiquée';
    return description.replace(/["-]/g, '').replace(/\[SDM\]\.$/, '');
};

const BookModal = ({ book, isVisible, onClose, onAddToWishlist, onRemoveFromWishlist, wishlist, onAuthorPress, onPublisherPress }) => {
    if (!book) return null;

    const isInWishlist = wishlist.some(wishlistBook => wishlistBook.id === book.id);

    const title = book?.volumeInfo.title || 'N/A';
    const authors = book?.volumeInfo.authors?.join(', ') || 'N/A';
    const publisher = book?.volumeInfo.publisher || 'N/A';
    const description = filterDescription(book?.volumeInfo.description);
    const pageCount = book?.volumeInfo.pageCount ? `${book.volumeInfo.pageCount} pages` : 'N/A';
    const country = book?.accessInfo.country ? `${getCountryFlagEmoji(book.accessInfo.country)} ${book.accessInfo.country}` : 'N/A';
    const publishedDate = book?.volumeInfo.publishedDate ? new Date(book.volumeInfo.publishedDate).toLocaleDateString() : 'N/A';
    const imageUrl = book?.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150';

    return (
        <Modal
            isVisible={isVisible}
            onSwipeComplete={onClose}
            swipeDirection="down"
            onBackdropPress={onClose}
            style={styles.modal}
        >
            <View style={styles.modalContent}>
                {book && (
                    <ScrollView contentContainerStyle={styles.bookDetailsContainer}>
                        <Image source={{ uri: imageUrl }} style={styles.bookImage} />
                        <Text style={styles.bookTitle}>{title}</Text>
                        <TouchableOpacity onPress={() => onAuthorPress(authors)}>
                            <Text style={styles.bookAuthors}>{authors}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onPublisherPress(publisher)}>
                            <Text style={styles.bookPublisher}>{publisher}</Text>
                        </TouchableOpacity>
                        <View style={styles.badges}>
                            <View style={styles.badge}>
                                <Text>{pageCount}</Text>
                            </View>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{country}</Text>
                            </View>
                            <View style={styles.badge}>
                                <Text>{publishedDate}</Text>
                            </View>
                        </View>
                        <Text numberOfLines={10} ellipsizeMode="tail" style={styles.bookDescription}>{description}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={onClose}
                            >
                                <Text style={styles.backButtonText}>Retour</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => {
                                    if (isInWishlist) {
                                        onRemoveFromWishlist(book.id);
                                    } else {
                                        onAddToWishlist(book);
                                    }
                                    onClose();
                                }}
                            >
                                <Text style={styles.addButtonText}>
                                    {isInWishlist ? 'Retirer de la liste d\'envies' : 'Ajouter à la liste d\'envies'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: '90%',
    },
    bookDetailsContainer: {
        alignItems: 'center',
    },
    bookImage: {
        width: 150,
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    bookTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bookAuthors: {
        fontSize: 16,
        marginBottom: 5, // Ajout d'espace entre l'auteur et l'éditeur
        color: 'blue',
        textDecorationLine: 'underline',
    },
    bookPublisher: {
        fontSize: 14,
        marginBottom: 20, // Ajout d'espace entre l'éditeur et la description
        color: 'blue',
        textDecorationLine: 'underline',
    },
    badges: {
        flexDirection: 'row',
        marginBottom: 20,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    badge: {
        backgroundColor: '#eee',
        padding: 5,
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeText: {
        marginLeft: 5,
    },
    bookDescription: {
        fontSize: 14,
        marginBottom: 30, // Ajout d'espace entre la description et les boutons
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    addButton: {
        backgroundColor: colors.primary,
        paddingVertical: 15, // Ajustement de la taille des boutons
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center', // Centrer le texte verticalement
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center', // Centrer le texte horizontalement
    },
    backButton: {
        backgroundColor: '#ccc',
        paddingVertical: 15, // Ajustement de la taille des boutons
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center', // Centrer le texte verticalement
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center', // Centrer le texte horizontalement
    },
});

export default BookModal;
