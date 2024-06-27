import AsyncStorage from '@react-native-async-storage/async-storage';

const WISHLIST_KEY = 'WISHLIST';

export const addToWishlist = async (book) => {
    try {
        const wishlist = await getWishlist();
        wishlist.push(book);
        await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (error) {
        console.error('Erreur lors de l\'ajout à la liste d\'envies', error);
    }
};

export const getWishlist = async () => {
    try {
        const wishlist = await AsyncStorage.getItem(WISHLIST_KEY);
        return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
        console.error('Erreur lors de la récupération de la liste d\'envies', error);
        return [];
    }
};

export const removeFromWishlist = async (bookId) => {
    try {
        let wishlist = await getWishlist();
        wishlist = wishlist.filter(book => book.id !== bookId);
        await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (error) {
        console.error('Erreur lors de la suppression de la liste d\'envies', error);
    }
};

export const clearWishlist = async () => {
    try {
        await AsyncStorage.removeItem(WISHLIST_KEY);
    } catch (error) {
        console.error('Erreur lors de la suppression de la liste d\'envies', error);
    }
};
