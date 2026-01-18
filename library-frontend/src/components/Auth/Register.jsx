import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import classes from './Register.module.css'
import Inp from "../UI/input/Inp.jsx"



const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
    });
    const latinRegex = /^[a-zA-Z0-9\s]*$/;
    const formatDjangoError = (errorData) => {
        if (!errorData) return 'Неизвестная ошибка';
        if (typeof errorData === 'string') {
            return errorData;
        }
        
        if (typeof errorData === 'object') {
            const errors = [];
            
            if (errorData.email) {
                let emailErrors = Array.isArray(errorData.email) 
                    ? errorData.email.join(', ')
                    : String(errorData.email);
                errors.push(`${emailErrors}`);
            }
            
            if (errorData.password) {
                const passwordErrors = Array.isArray(errorData.password) 
                    ? errorData.password.join(', ') 
                    : String(errorData.password);
                errors.push(`${passwordErrors}`);
            }
            
            if (errorData.username) {
                const usernameErrors = Array.isArray(errorData.username) 
                    ? errorData.username.join(', ') 
                    : String(errorData.username);
                errors.push(`${usernameErrors}`);
            }
            
            if (errorData.non_field_errors) {
                const nonFieldErrors = Array.isArray(errorData.non_field_errors) 
                    ? errorData.non_field_errors.join(', ') 
                    : String(errorData.non_field_errors);
                errors.push(nonFieldErrors);
            }
            
            if (errors.length === 0) {
                for (const [key, value] of Object.entries(errorData)) {
                    const fieldErrors = Array.isArray(value) 
                        ? value.join(', ') 
                        : String(value);
                    errors.push(`${key}: ${fieldErrors}`);
                }
            }
            return errors.join('. ');
        }
        return String(errorData);
    };
    
    const [error, setError] = useState(''); 
    const [reg, setReg] = useState(true)
    const { register, login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        if (e.target.name == "username") {
            if (latinRegex.test(e.target.value)) {
                setFormData({
                    ...formData,
                    [e.target.name]: e.target.value
                });
            } else {
                setError("Имя пользователя может содержвать только латинсике буквы и символы")
            }
        } else {
            setFormData({
                    ...formData,
                    [e.target.name]: e.target.value
                });
                
        }
        
        
    };

    const handleRegSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            if (formData.password !== formData.password2) {
                setError('Пароли не совпадают');
                setLoading(false);
                return;
            }
            
            const result = await register(formData);
            
            if (result.success) {
                navigate('/');
            } else {
                setError(formatDjangoError(result.error) || 'Ошибка регистрации');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    const handleLogSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const loginData = {
                username: formData.username,
                password: formData.password
            };
            
            const result = await login(loginData);
            
            if (result.success) {
                navigate('/'); 
            } else {
                const errorMessage = typeof result.error === 'string' 
                ? result.error 
                : result.error.error
                setError(errorMessage)
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={classes.mainDiv}>
            <div className={classes.window}>
                <div className={classes.titleDiv}>
                    <button 
                        className={`${classes.title} ${reg ? classes.titleActive : ""}`} 
                        onClick={() => {setReg(true); setError('');}}
                        type="button"
                    >
                        Регистрация
                    </button>
                    <button 
                        className={`${classes.title} ${!reg ? classes.titleActive : ""}`} 
                        onClick={() => {setReg(false); setError('');}}
                        type="button"
                    >
                        Вход
                    </button>
                </div>
                
                {error && (
                    <div className={classes.errorMessage}>
                        {error}
                    </div>
                )}
                
                <div>
                    {reg ? 
                    <form onSubmit={handleRegSubmit} className='container' noValidate>
                        <Inp 
                            label="Имя пользователя" 
                            id="username" 
                            name="username"
                            type="text"
                            value={formData.username} 
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        
                        
                        <Inp 
                            label="Пароль" 
                            id="password" 
                            name="password"
                            type="password" 
                            value={formData.password} 
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        
                        <Inp 
                            label="Подтвердите пароль" 
                            id="password2" 
                            name="password2"
                            type="password" 
                            value={formData.password2} 
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        
                        <button 
                            type="submit" 
                            className={classes.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                        </button>
                    </form>    
                    : 
                    <form onSubmit={handleLogSubmit} className='container' noValidate>
                        <Inp 
                            label="Имя пользователя" 
                            id="username" 
                            name="username"
                            type="text" 
                            value={formData.username} 
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        <Inp 
                            label="Пароль" 
                            id="password" 
                            name="password"
                            type="password" 
                            value={formData.password} 
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            className={classes.submitButton}
                            disabled={loading}
                        >
                            {loading ? 'Загрузка...' : 'Войти'}
                        </button>
                    </form>
                    }
                </div>
            </div>
        </div>
    );
};

export default Register;