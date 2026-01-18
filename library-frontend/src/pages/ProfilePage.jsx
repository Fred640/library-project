import React from "react";
import Btn from "../components/UI/button/Btn";
import { useNavigate } from "react-router-dom";
import { useFavoriteBooks, useFavoriteAuthors } from '../hooks/useFavoriteItems.js'
import List from "../components/UI/list/List.jsx";
import CardsList from '../components/Card/CardsList.jsx'
import AuthorsList from '../components/Author/AuthorsList.jsx'
import Headertemplate from '../components/header/HeaderTemplate.jsx'
import Profile from '../components/UI/Profile/Profile.jsx'
import { useAuth } from "../components/context/AuthContext";
const ProfilePage = () => {
    const {user, isAuthenticated} = useAuth()
    const navigate = useNavigate()
    const {logout} = useAuth()
    const { books, fetchBooks, refreshBooks } = useFavoriteBooks()
    const { authors, fetchAuthors, refreshAuthors } = useFavoriteAuthors()
    const logoutClick = (event) => {
        event.preventDefault()
        logout(); navigate('/reg/')
    }

    const Elements = [
    {content:<Btn onClick={() => {navigate(-1)}}>Назад</Btn>, divClasses:"col-lg-3 col-md-6 col-12"},
    {content: <Profile />, divClasses:"col-lg-3 col-md-12"},
    {content:<Btn onClick={() => {logout(); navigate('/reg/')}}>Выйти</Btn>, divClasses:"col-lg-3 col-md-6 col-12"},
  ]
    return(
        <>
        <Headertemplate ContainerElements={Elements} searchIclude={false}/>
        <List title={"Избранные книги"}>
            <CardsList books={books} isCardsList={true}/>
        </List>
        <List title={'Избранные авторы'} >
            <AuthorsList authors={authors} isCardLink={true}/>
        </List>
        <div>

        {user.is_staff ? 
        <div>Вы автор</div>
        :<div style={{display:"flex", justifyContent:"center"}}><Btn onClick={() => navigate('/AuthorReg')}>Стать автором</Btn></div>}
        </div>
        </>
    )
}

export default ProfilePage