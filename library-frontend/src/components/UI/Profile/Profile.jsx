import React from "react";
import classes from "../../header/Header.module.css"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const Profile = () => {
    
    const navigate = useNavigate()
    const {user, isAuthenticated} = useAuth()
    if (isAuthenticated) {
        return (
        <div className={classes.profileDiv}>
            <button onClick={() => navigate("/profile/")} style={{backgroundColor:`${user.color}`}} className={classes.Avatar}>{String(user.username)[0]}</button>
            <button onClick={() => navigate("/profile/")} className={classes.nickname}>{user.username}</button>
            
        </div>
        )
    } else {
        return(
            <Link to="/reg/">Вход/Регистрация</Link>
        )
        
    }
}

export default Profile