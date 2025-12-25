import React from "react";
import HeaderTemplate from "../components/header/HeaderTemplate";
import { useParams } from 'react-router-dom';
import Profile from "../components/UI/Profile/Profile";
import Btn from "../components/UI/button/Btn";
import CardsList from "../components/Card/CardsList";
import "../styles/pages/AuthorPage.css"
import { useAuthorWithBooks } from "../hooks/useAuthorWithBooks";
import { useNavigate } from "react-router-dom";
import Author from "../components/Author/Author";
import { Link } from "react-router-dom";

const AuthorPage = () => {
    const navigate= useNavigate()
    const Elements = [
        {content:<Profile User={{name:"Fedor Sapronov", color:"red"}}/>, divClasses:"col-lg-3 col-md-12"},
        {content:<Btn onClick={()=>{navigate(-1)}}>Назад</Btn>, divClasses:"col-lg-3 col-md-6 col-12"},
    ]

    const params = useParams()
    const {author, books, loading, error} = useAuthorWithBooks(params.author_slug)
    console.log('Author:', author)

    if (loading) {
        return (
            <>
                <HeaderTemplate 
                    ContainerElements={Elements} 
                    searchIclude={true} 
                    modaleSearchProps={{placeholder:"Введите название книги"}}
                />
                <div>Загрузка...</div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <HeaderTemplate 
                    ContainerElements={Elements} 
                    searchIclude={true} 
                    modaleSearchProps={{placeholder:"Введите название книги"}}
                />
                <div>Ошибка: {error}</div>
            </>
        )
    }


    if (!author) {
        return (
            <>
                <HeaderTemplate 
                    ContainerElements={Elements} 
                    searchIclude={true} 
                    modaleSearchProps={{placeholder:"Введите название книги"}}
                />
                <div>Автор не найден</div>
            </>
        )
    }

    return (
        <>
            <HeaderTemplate 
                ContainerElements={Elements} 
            />
            
            <div className="author-page-container">
                <div className="author-page-content">
                    <div className="breadcrumbs">
                        <span onClick={() => navigate("/")}>Главная</span>
                        <span> / </span>
                        <span onClick={() => navigate("/authors")}>Авторы</span>
                        <span> / </span>
                        <span to={`/author/${author.slug}/`}>{author.name}</span>
                        <span> / </span>
                    </div>

                    <div className="author-main-info">
                        <div className="author-cover">
                            <Author author={author} link={false}/>
                        </div>
                        <div className="author-details">
                            {author.user_name ?
                            <div><span>Имя пользователя: </span>{author.user_name}</div> 
                            : <></>}
                            <div className="author-actions">
                                <Btn className="btn">
                                    Добавить в избранных
                                </Btn>
                            </div>
                            <CardsList books={books} isAuthorPage={true}/>
                            
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default AuthorPage