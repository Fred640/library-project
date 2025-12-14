import React from "react";
import HeaderTemplate from "../components/header/HeaderTemplate";
import { useParams } from 'react-router-dom';
import Profile from "../components/UI/Profile/Profile";
import { Link } from "react-router-dom";
import Btn from "../components/UI/button/Btn";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CardsList from "../components/Card/CardsList";
import { useEffect } from "react";
import { apiService } from '../services/api';
import "../styles/pages/AuthorPage.css"
import { useAuthorWithBooks } from "../hooks/useAuthorWithBooks";

const AuthorPage = () => {
    const Elements = [
    {content:<Profile User={{name:"Fedor Sapronov", color:"red"}}/>, divClasses:"col-lg-3 col-md-12"},
    {content:<Btn onClick={()=>{navigate(-1)}}>Назад</Btn>, divClasses:"col-lg-3 col-md-6 col-12"},
    ]
    const {author_id} = useParams()
    const {author, books, loading, error} = useAuthorWithBooks(author_id)


    return(
        <>
        <HeaderTemplate ContainerElements={Elements} searchIclude={true} modaleSearchProps={{placeholder:"Введите название книги"}}/>
        <div>{author.name}</div>
        <CardsList books={books}/>
        </>
    )
}

export default AuthorPage