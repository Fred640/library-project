import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            fetchCurrentUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/auth/me/');
            setUser(response.data);
        } catch (error) {
            console.error('Ошибка загрузки пользователя:', error);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await axios.post('http://localhost:8000/auth/register/', userData);
            
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
            
            setUser(response.data.user);
            
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data || { error: 'Ошибка регистрации' };
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const completeRegistration = async (userData) => {
        try {
            setError(null);
            const response = await axios.post('http://localhost:8000/auth/complete-registration/', userData);
            
            setUser(response.data.user);
            
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data || { error: 'Ошибка завершения регистрации' };
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await axios.post('http://localhost:8000/auth/login/', credentials);
            
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
            
            setUser(response.data.user);
            
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data || { error: 'Ошибка входа' };
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8000/auth/logout/');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setError(null);
        }
    };

    const checkRegistrationStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8000/auth/registration-status/');
            return response.data;
        } catch (error) {
            console.error('Ошибка проверки статуса:', error);
            return { registration_complete: false };
        }
    };

    const value = {
        user,
        loading,
        error,
        register,
        completeRegistration,
        login,
        logout,
        checkRegistrationStatus,
        isAuthenticated: !!user,
        isRegistrationComplete: user?.is_staff || false
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};