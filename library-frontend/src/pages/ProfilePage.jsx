import React from "react";
import { useAuth } from "../components/context/AuthContext";
import Btn from "../components/UI/button/Btn";
import { useNavigate } from "react-router-dom";
import { useFavoriteBooks } from '../hooks/useFavoriteItems.js'
const ProfilePage = () => {
    const navigate = useNavigate()
    const {logout} = useAuth()
    const { books, fetchBooks, refreshBooks } = useFavoriteBooks()
    const logoutClick = (event) => {
        event.preventDefault()
        logout(); navigate(-1)
    }

    return(
        <>
        <Btn onClick={logoutClick}>Выйти</Btn>
        </>
        
    )
}

export default ProfilePage