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

const toggleFavoriteDiary = useCallback(async (diaryId) => {
    setLoading(true)
    setError(null)
    try {
        const response = await apiService.toggleFavoriteDiary(diaryId)
        return response.data
    } catch (error) {
        setError(error)
        throw error
    } finally {
        setLoading(false)
    }
}, [])

    return {
        toggleFavoriteBook,
        toggleFavoriteAuthor,
        toggleFavoriteDiary,
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

    const checkDiaryFavoriteStatus = useCallback(async (diaryId) => {
        setLoading(true)
        setError(null)

        try {
            const response = await apiService.checkDiaryFavoriteStatus(diaryId)
            return response.data
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        checkBookFavoriteStatus,
        checkAuthorFavoriteStatus,
        checkDiaryFavoriteStatus,
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
            setIsFavorite(false);
            setLoading(false);
            setInitialized(true);
            return { is_favorite: false };
        }

        setLoading(true);
        setError(null);
        
        try {
            const result = await checkBookFavoriteStatus(bookId);
            setIsFavorite(result.is_favorite);
            setInitialized(true);
            return result;
        } catch (err) {
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
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const result = await toggleFavoriteBook(bookId);
            
            const newStatus = result.status === 'added';
            setIsFavorite(newStatus);
            
            return result;
        } catch (err) {
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
                setIsFavorite(result.is_favorite);
            } catch (err) {
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
            setIsFavorite(false);
            setLoading(false);
            setInitialized(true);
            return { is_favorite: false };
        }

        setLoading(true);
        setError(null);
        
        try {
            const result = await checkAuthorFavoriteStatus(authorId);
            setIsFavorite(result.is_favorite);
            setInitialized(true);
            return result;
        } catch (err) {
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
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const result = await toggleFavoriteAuthor(authorId);
            
            const newStatus = result.status === 'added';
            setIsFavorite(newStatus);
            
            return result;
        } catch (err) {
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
                setIsFavorite(result.is_favorite);
            } catch (err) {
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


export const useDiaryFavorite = (diaryId) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const prevDiaryIdRef = useRef(null);
    
    const { toggleFavoriteDiary } = useFavorites();
    const { checkDiaryFavoriteStatus } = useFavoriteStatus();

    const checkStatus = useCallback(async () => {
        if (!diaryId) {
            setIsFavorite(false);
            setLoading(false);
            setInitialized(true);
            return { is_favorite: false };
        }

        setLoading(true);
        setError(null);
        
        try {
            const result = await checkDiaryFavoriteStatus(diaryId);
            setIsFavorite(result.is_favorite);
            setInitialized(true);
            return result;
        } catch (err) {
            setError(err);
            setIsFavorite(false);
            setInitialized(true);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [diaryId, checkDiaryFavoriteStatus]);

    const toggleFavorite = useCallback(async () => {
        if (!diaryId) {
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const result = await toggleFavoriteDiary(diaryId);
            
            const newStatus = result.status === 'added';
            setIsFavorite(newStatus);
            
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [diaryId, isFavorite, toggleFavoriteDiary]);

    useEffect(() => {
        if (diaryId === prevDiaryIdRef.current) {
            if (!diaryId) {
                setIsFavorite(false);
                setLoading(false);
                setInitialized(true);
            }
            return;
        }

        prevDiaryIdRef.current = diaryId;
        
        setIsFavorite(false);
        setLoading(true);
        setInitialized(false);
        setError(null);

        if (!diaryId) {
            setIsFavorite(false);
            setLoading(false);
            setInitialized(true);
            return;
        }
        
        const loadStatus = async () => {
            try {
                const result = await checkDiaryFavoriteStatus(diaryId);
                setIsFavorite(result.is_favorite);
            } catch (err) {
                setIsFavorite(false);
                setError(err);
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };

        loadStatus();
    }, [diaryId]);

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