import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import BookModal from '../components/BookModalComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import { addToWishlist, getWishlist, removeFromWishlist } from "../utils/wishlist";
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen({ route }) {
    const [searchType, setSearchType] = useState('isbn'); // Par défaut, la recherche est par ISBN
    const [searchQuery, setSearchQuery] = useState('');
    const [book, setBook] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const navigation = useNavigation();

    const fetchWishlist = async () => {
        const wishlistBooks = await getWishlist();
        setWishlist(wishlistBooks);
    };

    useEffect(() => {
        fetchWishlist();

        if (route.params?.query && route.params?.type) {
            setSearchType(route.params.type);
            setSearchQuery(route.params.query);
            searchBook(route.params.query, route.params.type);
        }
    }, [route.params]);

    const searchBook = async (query, type = searchType) => {
        let searchQuery;
        if (type === 'isbn') {
            searchQuery = `isbn:${query}`;
        } else if (type === 'title') {
            searchQuery = `intitle:${query}`;
        } else if (type === 'author') {
            searchQuery = `inauthor:${query}`;
        } else if (type === 'publisher') {
            searchQuery = `inpublisher:${query}`;
        }

        try {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`);
            if (response.data.items && response.data.items.length > 0) {
                const uniqueResults = response.data.items.reduce((unique, item) => {
                    if (!unique.some(obj => obj.id === item.id)) {
                        unique.push(item);
                    }
                    return unique;
                }, []);
                setSearchResults(uniqueResults);
            } else {
                setSearchResults([]);
                alert('Aucun résultat trouvé');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la recherche');
        }
    };

    const handleResultPress = async (bookId) => {
        try {
            const bookDetails = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
            setBook(bookDetails.data);
            setModalVisible(true);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la récupération des détails du livre');
        }
    };

    const handleAddToWishlist = async (book) => {
        await addToWishlist(book);
        fetchWishlist();
        if (route.params?.onGoBack) route.params.onGoBack(); // Call the callback function
        alert('Livre ajouté à la liste d\'envies');
    };

    const handleRemoveFromWishlist = async (book) => {
        await removeFromWishlist(book);
        fetchWishlist();
        if (route.params?.onGoBack) route.params.onGoBack(); // Call the callback function
        alert('Livre retiré de la liste d\'envies');
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const getIconName = () => {
        switch (searchType) {
            case 'isbn':
                return 'barcode-outline';
            case 'title':
                return 'book-outline';
            case 'author':
                return 'person-outline';
            case 'publisher':
                return 'business-outline';
            default:
                return 'search-outline';
        }
    };

    const getPlaceholderText = () => {
        switch (searchType) {
            case 'isbn':
                return 'Entrer ISBN';
            case 'title':
                return 'Entrer Titre';
            case 'author':
                return 'Entrer Auteur';
            case 'publisher':
                return 'Entrer Maison d\'édition';
            default:
                return 'Rechercher';
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recherche de Livre</Text>
            <View style={styles.searchOptions}>
                <Button title="ISBN" onPress={() => setSearchType('isbn')} color={searchType === 'isbn' ? 'blue' : 'gray'} />
                <Button title="Titre" onPress={() => setSearchType('title')} color={searchType === 'title' ? 'blue' : 'gray'} />
                <Button title="Auteur" onPress={() => setSearchType('author')} color={searchType === 'author' ? 'blue' : 'gray'} />
                <Button title="Maison d'édition" onPress={() => setSearchType('publisher')} color={searchType === 'publisher' ? 'blue' : 'gray'} />
            </View>
            <View style={styles.searchInputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={getPlaceholderText()}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={clearSearch}>
                        <Icon name="close-circle" size={24} color="gray" style={styles.icon} />
                    </TouchableOpacity>
                ) : (
                    <Icon name={getIconName()} size={24} color="gray" style={styles.icon} />
                )}
            </View>
            <Button title="Rechercher" onPress={() => searchBook(searchQuery)} />

            <BookModal
                book={book}
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAddToWishlist={handleAddToWishlist}
                onRemoveFromWishlist={(bookId) => handleRemoveFromWishlist(bookId)}
                wishlist={wishlist}
                onAuthorPress={(author) => searchBook(author, 'author')}
                onPublisherPress={(publisher) => searchBook(publisher, 'publisher')}
            />

            <ScrollView contentContainerStyle={styles.searchResultsContainer}>
                {searchResults.map(result => (
                    <TouchableOpacity key={result.id} style={styles.searchResult} onPress={() => handleResultPress(result.id)}>
                        <Image
                            source={{ uri: result.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150' }}
                            style={styles.resultImage}
                        />
                        <View style={styles.resultInfo}>
                            <Text style={styles.resultTitle}>{result.volumeInfo.title || 'N/A'}</Text>
                            <Text style={styles.resultAuthors}>{result.volumeInfo.authors?.join(', ') || 'N/A'}</Text>
                            <Text style={styles.resultPublisher}>{result.volumeInfo.publisher || 'N/A'}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 150, // Baisser la partie recherche sur l'écran
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    searchOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
    },
    icon: {
        marginLeft: 10,
    },
    searchResultsContainer: {
        paddingBottom: 20,
        paddingTop: 30, // Ajouter de l'espace entre "Rechercher" et les résultats
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
});
