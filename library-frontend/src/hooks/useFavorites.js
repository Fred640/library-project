import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { useEffect, useRef } from 'react';
export const useFavorites = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleFavoriteBook = useCallback(async (bookId) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.toggleFavoriteBook(bookId);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data || { error: 'Ошибка при изменении избранного' };
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleFavoriteAuthor = useCallback(async (authorId) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.toggleFavoriteAuthor(authorId);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data || { error: 'Ошибка при изменении избранного' };
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        toggleFavoriteBook,
        toggleFavoriteAuthor,
        loading,
        error,
        clearError: () => setError(null)
    };
};

export const useFavoriteStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkBookFavoriteStatus = useCallback(async (bookId) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.checkBookFavoriteStatus(bookId);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data || { error: 'Ошибка проверки статуса' };
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    const checkAuthorFavoriteStatus = useCallback(async (authorId) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await apiService.checkAuthorFavoriteStatus(authorId);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data || { error: 'Ошибка проверки статуса' };
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        checkBookFavoriteStatus,
        checkAuthorFavoriteStatus,
        loading,
        error,
        clearError: () => setError(null)
    };
};




export const useBookFavorite = (bookId) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const prevBookIdRef = useRef(null);
    
    const { toggleFavoriteBook } = useFavorites();
    const { checkBookFavoriteStatus } = useFavoriteStatus();

    const checkStatus = useCallback(async () => {
        if (!bookId) {
            console.log("No bookId provided, setting isFavorite to false");
            setIsFavorite(false);
            setLoading(false);
            setInitialized(true);
            return { is_favorite: false };
        }

        console.log(`Checking favorite status for book ${bookId}`);
        setLoading(true);
        setError(null);
        
        try {
            const result = await checkBookFavoriteStatus(bookId);
            console.log(`Status result for book ${bookId}:`, result);
            setIsFavorite(result.is_favorite);
            setInitialized(true);
            return result;
        } catch (err) {
            console.error(`Error checking status for book ${bookId}:`, err);
            setError(err);
            setIsFavorite(false);
            setInitialized(true);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [bookId, checkBookFavoriteStatus]);

    const toggleFavorite = useCallback(async () => {
        if (!bookId) {
            console.error("Cannot toggle favorite: no bookId");
            return;
        }

        console.log(`Toggling favorite for book ${bookId}, current status: ${isFavorite}`);
        setLoading(true);
        setError(null);
        
        try {
            const result = await toggleFavoriteBook(bookId);
            console.log(`Toggle result for book ${bookId}:`, result);
            
            const newStatus = result.status === 'added';
            console.log(`Setting isFavorite to: ${newStatus}`);
            setIsFavorite(newStatus);
            
            return result;
        } catch (err) {
            console.error(`Error toggling favorite for book ${bookId}:`, err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [bookId, isFavorite, toggleFavoriteBook]);

    useEffect(() => {
        if (bookId === prevBookIdRef.current) {
            if (!bookId) {
                setIsFavorite(false);
                setLoading(false);
                setInitialized(true);
            }
            return;
        }

        prevBookIdRef.current = bookId;
        
        setIsFavorite(false);
        setLoading(true);
        setInitialized(false);
        setError(null);

        if (!bookId) {
            setIsFavorite(false);
            setLoading(false);
            setInitialized(true);
            return;
        }
        
        const loadStatus = async () => {
            try {
                const result = await checkBookFavoriteStatus(bookId);
                console.log(`Initial load for book ${bookId}:`, result);
                setIsFavorite(result.is_favorite);
            } catch (err) {
                console.error(`Error in initial load for book ${bookId}:`, err);
                setIsFavorite(false);
                setError(err);
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };

        loadStatus();
    }, [bookId]);

    return {
        isFavorite,
        loading,
        error,
        initialized,
        checkStatus,
        toggleFavorite,
        refreshStatus: checkStatus
    };
};

export const useAuthorFavorite = (authorId) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const prevAuthorIdRef = useRef(null);
    
    const { toggleFavoriteAuthor } = useFavorites();
    const { checkAuthorFavoriteStatus } = useFavoriteStatus();

    const checkStatus = useCallback(async () => {
        if (!authorId) {
            console.log("No authorId provided, setting isFavorite to false");
            setIsFavorite(false);
            setLoading(false);
            setInitialized(true);
            return { is_favorite: false };
        }

        console.log(`Checking favorite status for author ${authorId}`);
        setLoading(true);
        setError(null);
        
        try {
            const result = await checkAuthorFavoriteStatus(authorId);
            console.log(`Status result for author ${authorId}:`, result);
            setIsFavorite(result.is_favorite);
            setInitialized(true);
            return result;
        } catch (err) {
            console.error(`Error checking status for author ${authorId}:`, err);
            setError(err);
            setIsFavorite(false);
            setInitialized(true);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authorId, checkAuthorFavoriteStatus]);

    const toggleFavorite = useCallback(async () => {
        if (!authorId) {
            console.error("Cannot toggle favorite: no authorId");
            return;
        }

        console.log(`Toggling favorite for author ${authorId}, current status: ${isFavorite}`);
        setLoading(true);
        setError(null);
        
        try {
            const result = await toggleFavoriteAuthor(authorId);
            console.log(`Toggle result for author ${authorId}:`, result);
            
            const newStatus = result.status === 'added';
            console.log(`Setting isFavorite to: ${newStatus}`);
            setIsFavorite(newStatus);
            
            return result;
        } catch (err) {
            console.error(`Error toggling favorite for author ${authorId}:`, err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authorId, isFavorite, toggleFavoriteAuthor]);

    useEffect(() => {
        if (authorId === prevAuthorIdRef.current) {
            if (!authorId) {
                setIsFavorite(false);
                setLoading(false);
                setInitialized(true);
            }
            return;
        }

        prevAuthorIdRef.current = authorId;
        
        setIsFavorite(false);
        setLoading(true);
        setInitialized(false);
        setError(null);

        if (!authorId) {
            setIsFavorite(false);
            setLoading(false);
            setInitialized(true);
            return;
        }
        
        const loadStatus = async () => {
            try {
                const result = await checkAuthorFavoriteStatus(authorId);
                console.log(`Initial load for author ${authorId}:`, result);
                setIsFavorite(result.is_favorite);
            } catch (err) {
                console.error(`Error in initial load for author ${authorId}:`, err);
                setIsFavorite(false);
                setError(err);
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };

        loadStatus();
    }, [authorId]);

    return {
        isFavorite,
        loading,
        error,
        initialized,
        checkStatus,
        toggleFavorite,
        refreshStatus: checkStatus
    };
};