import React, { useState, useEffect, useCallback } from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Modal, Image} from 'react-native';
import { FavoriteBookComponent } from '../components/FavoriteBookComponent';
import { MyBookComponent } from '../components/MyBookComponent';
import { addToWishlist, getWishlist, removeFromWishlist } from '../utils/wishlist';
import { Ionicons } from '@expo/vector-icons';
import BookModal from '../components/BookModalComponent';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import colors from "../../colors";

const EmptyStateComponent = ({ message, onPress }) => (
    <View style={styles.emptyStateContainer}>
        <Ionicons name="book-outline" size={80} color="gray" />
        <Text style={styles.emptyStateText}>{message}</Text>
        <TouchableOpacity style={styles.searchButton} onPress={onPress}>
            <Text style={styles.searchButtonText}>Ajouter des livres</Text>
        </TouchableOpacity>
    </View>
);

export default function HomeScreen() {
    const [favorites, setFavorites] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isWishlistModalVisible, setIsWishlistModalVisible] = useState(false);
    const navigation = useNavigation();

    const fetchBooks = async () => {
        const wishlistBooks = await getWishlist();
        const reversedWishlist = wishlistBooks.reverse();
        setWishlist(reversedWishlist);

        const randomFavorites = [];
        const copyWishlist = [...reversedWishlist];

        while (randomFavorites.length < 5 && copyWishlist.length > 0) {
            const randomIndex = Math.floor(Math.random() * copyWishlist.length);
            randomFavorites.push(copyWishlist[randomIndex]);
            copyWishlist.splice(randomIndex, 1);
        }

        setFavorites(randomFavorites);
    };

    useFocusEffect(
        useCallback(() => {
            fetchBooks();
        }, [])
    );

    const renderFavoriteBook = ({ item }) => (
        <TouchableOpacity onPress={() => { setSelectedBook(item); setIsModalVisible(true); }}>
            <FavoriteBookComponent
                title={item.volumeInfo.title}
                author={item.volumeInfo.authors?.join(', ') || 'N/A'}
                description={item.volumeInfo.description || 'Description non disponible'}
                coverUrl={item.volumeInfo.imageLinks?.thumbnail}
            />
        </TouchableOpacity>
    );

    const renderMyBook = ({ item }) => (
        <TouchableOpacity onPress={() => { setSelectedBook(item); setIsModalVisible(true); }}>
            <MyBookComponent
                title={item.volumeInfo.title}
                author={item.volumeInfo.authors?.join(', ') || 'N/A'}
                coverUrl={item.volumeInfo.imageLinks?.thumbnail}
            />
        </TouchableOpacity>
    );

    const handleAddToWishlist = async (book) => {
        await addToWishlist(book);
        fetchBooks();
        alert('Livre ajouté à la liste d\'envies');
    };

    const handleRemoveFromWishlist = async (bookId) => {
        await removeFromWishlist(bookId);
        fetchBooks();
        alert('Livre retiré de la liste d\'envies');
    };

    const handleAuthorPress = (author) => {
        setIsModalVisible(false);
        navigation.navigate('Main', { screen: 'Search', params: { query: author, type: 'author' } });
    };

    const handlePublisherPress = (publisher) => {
        setIsModalVisible(false);
        navigation.navigate('Main', { screen: 'Search', params: { query: publisher, type: 'publisher' } });
    };

    const handleAddBooksPress = () => {
        navigation.navigate('Search', {
            onGoBack: () => fetchBooks(), // Pass a callback to refresh when coming back
        });
    };

    const handleShowWishlist = () => {
        setIsWishlistModalVisible(true);
    };

    const renderWishlistBook = ({ item }) => (
        <TouchableOpacity key={item.id} style={styles.searchResult} onPress={() => { setSelectedBook(item); setIsModalVisible(true); setIsWishlistModalVisible(false); }}>
            <Image
                source={{ uri: item.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150' }}
                style={styles.resultImage}
            />
            <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>{item.volumeInfo.title || 'N/A'}</Text>
                <Text style={styles.resultAuthors}>{item.volumeInfo.authors?.join(', ') || 'N/A'}</Text>
                <Text style={styles.resultPublisher}>{item.volumeInfo.publisher || 'N/A'}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView scrollEnabled={false} contentContainerStyle={styles.container}>
            {wishlist.length === 0 ? (
                <EmptyStateComponent
                    message="Votre liste d'envies est vide. Ajoutez des livres depuis la recherche."
                    onPress={handleAddBooksPress}
                />
            ) : (
                <>
                    <FlatList
                        data={favorites}
                        renderItem={renderFavoriteBook}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.favoriteBooks}
                    />
                    <TouchableOpacity style={styles.showMoreButton} onPress={handleShowWishlist}>
                        <Text style={styles.showMoreText}>Ma liste d'envies</Text>
                        <Ionicons name="chevron-forward-outline" size={20} color="black" />
                    </TouchableOpacity>
                    <FlatList
                        data={wishlist}
                        renderItem={renderMyBook}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.myBooks}
                    />
                </>
            )}
            <BookModal
                book={selectedBook}
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onAddToWishlist={handleAddToWishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                wishlist={wishlist}
                onAuthorPress={handleAuthorPress}
                onPublisherPress={handlePublisherPress}
            />

            <Modal
                visible={isWishlistModalVisible}
                onRequestClose={() => setIsWishlistModalVisible(false)}
                animationType="slide"
            >
                <View style={styles.modalContent}>
                    <FlatList
                        data={wishlist}
                        renderItem={renderWishlistBook}
                        keyExtractor={(item) => item.id}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setIsWishlistModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 180,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 10,
        paddingTop: 15,
    },
    favoriteBooks: {
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 20,
    },
    myBooks: {
        paddingRight: 10,
    },
    showMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    showMoreText: {
        color: 'black',
        fontFamily: 'Roboto Mono',
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 16,
        marginLeft: 10,
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    emptyStateText: {
        fontSize: 18,
        color: 'gray',
        marginTop: 20,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    searchButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContent: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        marginTop: 70
    },
    searchResult: {
        flexDirection: 'row',
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    resultImage: {
        width: 50,
        height: 75,
        marginRight: 10,
    },
    resultInfo: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultAuthors: {
        fontSize: 14,
        color: '#555',
    },
    resultPublisher: {
        fontSize: 12,
        color: '#999',
    },
    closeButton: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
