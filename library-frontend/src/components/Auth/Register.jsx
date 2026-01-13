import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import classes from './Register.module.css'
import Btn from '../UI/button/Btn.jsx'
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
    
    const [error, setError] = useState(''); 
    const [reg, setReg] = useState(true)
    const { register, login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                setError(result.error || 'Ошибка регистрации');
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
                setError(result.error || 'Ошибка входа');
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
                <span className={classes.backButton}>
                </span>
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
                            label="Email" 
                            id="email" 
                            name="email"
                            type="email" 
                            value={formData.email}
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