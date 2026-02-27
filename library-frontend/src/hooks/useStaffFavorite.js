import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api';

export const useStaffFavorite = () => {
    const [staffList, setStaffList] = useState([]);
    const [favoriteStaff, setFavoriteStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAllStaff = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllStaff();
            setStaffList(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data || 'Ошибка загрузки staff');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFavoriteStaff = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiService.getFavoriteStaff();
            setFavoriteStaff(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data || 'Ошибка загрузки избранного');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleFavorite = useCallback(async (userId) => {
        setLoading(true);
        try {
            const response = await apiService.toggleFavoriteStaff(userId);
            
            await fetchFavoriteStaff();
            
            return response.data;
        } catch (err) {
            setError(err.response?.data || 'Ошибка при изменении избранного');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchFavoriteStaff]);

    const isFavorite = useCallback((userId) => {
        return favoriteStaff.some(staff => staff.id === userId);
    }, [favoriteStaff]);

    useEffect(() => {
        fetchAllStaff();
        fetchFavoriteStaff();
    }, [fetchAllStaff, fetchFavoriteStaff]);

    return {
        staffList,
        favoriteStaff,
        loading,
        error,
        fetchAllStaff,
        fetchFavoriteStaff,
        toggleFavorite,
        isFavorite,
        clearError: () => setError(null)
    };
};

export const useSingleStaffFavorite = (userId) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toggleFavorite } = useStaffFavorite();

    const checkStatus = useCallback(async () => {
        try {
            const response = await apiService.checkStaffFavoriteStatus(userId);
            setIsFavorite(response.data.is_favorite);
        } catch (err) {
            console.error('Ошибка проверки статуса:', err);
        }
    }, [userId]);

    const toggle = useCallback(async () => {
        setLoading(true);
        try {
            const result = await toggleFavorite(userId);
            setIsFavorite(result.status === 'added');
            return result;
        } finally {
            setLoading(false);
        }
    }, [userId, toggleFavorite]);

    useEffect(() => {
        if (userId) {
            checkStatus();
        }
    }, [userId, checkStatus]);

    return {
        isFavorite,
        loading,
        toggleFavorite: toggle,
        checkStatus
    };
};