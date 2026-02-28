import React, { useState } from 'react';
import classes from './Register.module.css'
import Inp from "../UI/input/Inp.jsx"
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
const AuthorRegPage = () => {
    const navigate = useNavigate()
    const { user, completeRegistration } = useAuth();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await completeRegistration(formData);
        if (result.success) {
            navigate(-1)
        }
    };
    return (
        <div className={classes.mainDiv}>
            <div className={classes.window}>
                <button className={`${classes.title} ${classes.titleActive}`}>
                    Стать Автором
                </button>
                {/* {error && (
                    <div className={classes.errorMessage}>
                        {error}.
                    </div>
                )} */}
                <div>
                    <form className='container' noValidate
                    onSubmit={handleSubmit}>
                        <Inp 
                            label="Имя" 
                            id="name" 
                            name="name"
                            type="text"
                            value={formData.first_name} 
                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                            required
                        />
                        
                        
                        <Inp 
                            label="Фамилия" 
                            id="lasr_name" 
                            name="last_name"
                            value={formData.last_name} 
                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                            required
                        />
                        
                        <Inp 
                            label="потча" 
                            id="email" 
                            name="email"
                            value={formData.password2} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                        
                        <button 
                            type="submit" 
                            className={classes.submitButton}
                        >
                            Стать Aвтором
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AuthorRegPage