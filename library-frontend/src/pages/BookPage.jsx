import React from "react";
import HeaderTemplate from "../components/header/HeaderTemplate.jsx";
import { useParams, useNavigate, Link } from "react-router-dom";
import Btn from "../components/UI/button/Btn";
import Profile from "../components/UI/Profile/Profile";
import "../styles/pages/BookPage.css";
import { useBook } from '../hooks/useBook.js';
import BookCard from "../components/Card/BookCard.jsx";

const BookPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { book, loading, error } = useBook(params.book_slug);

    const Elements = [
        {
            content: <Profile User={{ name: "Fedor Sapronov", color: "red" }} />,
            divClasses: "col-lg-3 col-md-12"
        },
        {
            content: <Btn onClick={() => navigate(-1)}>Назад</Btn>,
            divClasses: "col-lg-3 col-md-6 col-12"
        },
    ];

    if (loading) {
        return (
            <>
                <HeaderTemplate 
                    ContainerElements={Elements} 
                />
                <div className="book-page-loading">
                    <div className="loading-spinner"></div>
                    <p>Загрузка книги...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <HeaderTemplate 
                    ContainerElements={Elements} 
                />
                <div className="book-page-error">
                    <h2>Ошибка</h2>
                    <p>{error}</p>
                    <Btn onClick={() => navigate(-1)}>Вернуться назад</Btn>
                </div>
            </>
        );
    }

    if (!book) {
        return (
            <>
                <HeaderTemplate 
                    ContainerElements={Elements} 
                />
                <div className="book-page-not-found">
                    <h2>Книга не найдена</h2>
                    <Btn onClick={() => navigate("/")}>На главную</Btn>
                </div>
            </>
        );
    }

    return (
        <>
            <HeaderTemplate 
                ContainerElements={Elements} 
            />
            
            <div className="book-page-container">
                <div className="book-page-content">
                    <div className="breadcrumbs">
                        <span onClick={() => navigate("/")}>Главная</span>
                        <span> / </span>
                        <span onClick={() => navigate("/authors")}>Авторы</span>
                        <span> / </span>
                        <span to={`/author/${book.author_slug}/`}>{book.author_name}</span>
                        <span> / </span>
                        <span className="current">{book.title}</span>
                    </div>

                    <div className="book-main-info">
                        <div className="book-cover">
                            <BookCard book={book} isList={false}/>
                        </div>
                        <div className="book-details">
                            <div className="book-author">
                                <span className="label">Автор: </span>
                                <Link to={`/author/${book.author_slug}/`} className="author-link">
                                    {book.author_name}
                                </Link>
                            </div>
                            
                            <div className="book-genre">
                                <span className="label">Жанр: </span>
                                <span className="genre">{book.genre}</span>
                            </div>
                            
                            {book.year && (
                                <div className="book-year">
                                    <span className="label">Год издания: </span>
                                    <span>{book.year}</span>
                                </div>
                            )}
                            
                            {book.description && (
                                <div className="book-description">
                                    <h3>Описание</h3>
                                    <p>{book.description}</p>
                                </div>
                            )}
                            
                            <div className="book-actions">
                                <Btn 
                                    className="btn"
                                    onClick={() => console.log("Скачать книгу:", book.id)}
                                >
                                    Скачать
                                </Btn>
                                
                                <Btn 
                                    className="btn"
                                    onClick={() => console.log("Читать онлайн:", book.id)}
                                >
                                    Читать онлайн
                                </Btn>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default BookPage;