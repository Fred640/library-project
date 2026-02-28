import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api';

export const useFavoriteItems = () => {
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [favoriteAuthors, setFavoriteAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllFavorites = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.getUserFavorites();
            setFavoriteBooks(response.data.favorite_books || []);
            setFavoriteAuthors(response.data.favorite_authors || []);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data || { error: 'Ошибка загрузки избранного' };
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFavoriteBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.getFavoriteBooks();
            setFavoriteBooks(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data || { error: 'Ошибка загрузки избранных книг' };
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFavoriteAuthors = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.getFavoriteAuthors();
            setFavoriteAuthors(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data || { error: 'Ошибка загрузки избранных авторов' };
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const isBookFavorite = useCallback((bookId) => {
        return favoriteBooks.some(book => book.id === bookId);
    }, [favoriteBooks]);

    const isAuthorFavorite = useCallback((authorId) => {
        return favoriteAuthors.some(author => author.id === authorId);
    }, [favoriteAuthors]);


    const updateFavoriteBooks = useCallback(async () => {
        await fetchFavoriteBooks();
    }, [fetchFavoriteBooks]);

    const updateFavoriteAuthors = useCallback(async () => {
        await fetchFavoriteAuthors();
    }, [fetchFavoriteAuthors]);

    return {
        favoriteBooks,
        favoriteAuthors,
        
        loading,
        error,
        
        fetchAllFavorites,
        fetchFavoriteBooks,
        fetchFavoriteAuthors,
        
        isBookFavorite,
        isAuthorFavorite,
        updateFavoriteBooks,
        updateFavoriteAuthors,
        

        clearError: () => setError(null),
        
        booksCount: favoriteBooks.length,
        authorsCount: favoriteAuthors.length,
        totalCount: favoriteBooks.length + favoriteAuthors.length
    };
};

export const useFavoriteBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.getFavoriteBooks();
            setBooks(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data || { error: 'Ошибка загрузки избранных книг' };
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshBooks = useCallback(async () => {
        return await fetchBooks();
    }, [fetchBooks]);

    const isBookFavorite = useCallback((bookId) => {
        return books.some(book => book.id === bookId);
    }, [books]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return {
        books,
        loading,
        error,
        fetchBooks,
        refreshBooks,
        isBookFavorite,
        clearError: () => setError(null),
        count: books.length
    };
};

export const useFavoriteAuthors = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAuthors = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.getFavoriteAuthors();
            setAuthors(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data || { error: 'Ошибка загрузки избранных авторов' };
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshAuthors = useCallback(async () => {
        return await fetchAuthors();
    }, [fetchAuthors]);

    const isAuthorFavorite = useCallback((authorId) => {
        return authors.some(author => author.id === authorId);
    }, [authors]);

    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]);

    return {
        authors,
        loading,
        error,
        fetchAuthors,
        refreshAuthors,
        isAuthorFavorite,
        clearError: () => setError(null),
        count: authors.length
    };
};


export const useFavoriteItemManager = () => {
    const favoriteItems = useFavoriteItems();
    const { toggleFavoriteBook, toggleFavoriteAuthor } = useFavorites();

    const toggleBookWithUpdate = useCallback(async (bookId) => {
        try {
            const result = await toggleFavoriteBook(bookId);
            await favoriteItems.updateFavoriteBooks();
            return result;
        } catch (err) {
            throw err;
        }
    }, [toggleFavoriteBook, favoriteItems.updateFavoriteBooks]);

    const toggleAuthorWithUpdate = useCallback(async (authorId) => {
        try {
            const result = await toggleFavoriteAuthor(authorId);
            await favoriteItems.updateFavoriteAuthors();
            return result;
        } catch (err) {
            throw err;
        }
    }, [toggleFavoriteAuthor, favoriteItems.updateFavoriteAuthors]);

    return {
        favoriteBooks: favoriteItems.favoriteBooks,
        favoriteAuthors: favoriteItems.favoriteAuthors,
        
        loading: favoriteItems.loading,
        error: favoriteItems.error,
        
        toggleBookFavorite: toggleBookWithUpdate,
        toggleAuthorFavorite: toggleAuthorWithUpdate,
        isBookFavorite: favoriteItems.isBookFavorite,
        isAuthorFavorite: favoriteItems.isAuthorFavorite,
        
        refreshAll: favoriteItems.fetchAllFavorites,
        refreshBooks: favoriteItems.updateFavoriteBooks,
        refreshAuthors: favoriteItems.updateFavoriteAuthors,
        
        booksCount: favoriteItems.booksCount,
        authorsCount: favoriteItems.authorsCount,
        totalCount: favoriteItems.totalCount
    };
};


export const useFavoriteDiaries = () => {
    const [favoriteDiaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDiaries = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.getFavoriteDiaries();
            setDiaries(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data || { error: 'Ошибка загрузки избранных дневников' };
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshDiaries = useCallback(async () => {
        return await fetchDiaries();
    }, [fetchDiaries]);

    const isDiaryFavorite = useCallback((diaryId) => {
        return favoriteDiaries.some(diary => diary.id === diaryId);
    }, [favoriteDiaries]);

    useEffect(() => {
        fetchDiaries();
    }, [fetchDiaries]);

    return {
        favoriteDiaries,
        loading,
        error,
        fetchDiaries,
        refreshDiaries,
        isDiaryFavorite,
        clearError: () => setError(null),
    };
};