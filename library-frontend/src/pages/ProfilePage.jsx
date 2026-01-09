import React from "react";
import { useAuth } from "../components/context/AuthContext";
import Btn from "../components/UI/button/Btn";
import { useNavigate } from "react-router-dom";
import { useFavoriteBooks, useFavoriteAuthors } from '../hooks/useFavoriteItems.js'
import List from "../components/UI/list/List.jsx";
import CardsList from '../components/Card/CardsList.jsx'
import AuthorsList from '../components/Author/AuthorsList.jsx'
const ProfilePage = () => {
    const navigate = useNavigate()
    const {logout} = useAuth()
    const { books, fetchBooks, refreshBooks } = useFavoriteBooks()
    const { authors, fetchAuthors, refreshAuthors } = useFavoriteAuthors()
    const logoutClick = (event) => {
        event.preventDefault()
        logout(); navigate('/reg/')
    }
    return(
        <>
        <Btn onClick={logoutClick}>Выйти</Btn>
        <List title={"Избранные книги"}>
            <CardsList books={books} isCardsList={true}/>
        </List>
        <List title={'Избранные авторы'} >
            <AuthorsList authors={authors}/>
        </List>
        </>
    )
}

export default ProfilePage