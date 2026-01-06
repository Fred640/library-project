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

    const [reg, setReg] = useState(true)

    
    const { register, login, error } = useAuth();

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
        
        const result = await register(formData);
        
        if (result.success) {
            navigate(-1);
        }}

    const handleLogSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const result = await login(formData);
        
        if (result.success) {
            navigate(-1);
        }
        setLoading(false);
    };

    return (
    <div className={classes.mainDiv}>
        <div className={classes.window}>
            <span className={classes.backButton}>
                <Btn onClick={() => {navigate(-1)}}>
                    Назад
                </Btn>
            </span>
            <div className={classes.titleDiv}>
                <button className={`${classes.title} ${reg ? classes.titleActive : ""}`} onClick={() => {setReg(true)}}>Регистрация</button>
                <button className={`${classes.title} ${!reg ? classes.titleActive : ""}`} onClick={() => {setReg(false)}}>Вход</button>
            </div>
            
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
                    />
                    
                    <Inp 
                        label="Email" 
                        id="email" 
                        name="email"
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    
                    <Inp 
                        label="Пароль" 
                        id="password" 
                        name="password"
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        required
                    />
                    
                    <Inp 
                        label="Подтвердите пароль" 
                        id="password2" 
                        name="password2"
                        type="password" 
                        value={formData.password2} 
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className={classes.submitButton}>Зарегистрироваться</button>
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
                    />
                    <Inp 
                        label="Пароль" 
                        id="password" 
                        name="password"
                        type="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className={classes.submitButton}>Войти</button>
                </form>
                }
                
            </div>
        </div>
    </div>
);
};

export default Register;