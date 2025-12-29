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
    const handleDownload = () => {
        if (book && book.download_url) {
            window.open(book.download_url, '_blank');
        } else {
            console.error("URL для скачивания не найден");
            alert("Файл книги недоступен для скачивания");
        }
    };
    const handleDownloadWithFetch = async () => {
        if (!book) return;
        
        try {
            // Используем fetch для скачивания
            const response = await fetch(`/api/books/${book.slug}/download/`);
            
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }
            
            // Получаем blob
            const blob = await response.blob();
            
            // Создаем ссылку для скачивания
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Определяем имя файла
            const filename = `${book.slug}.txt`; // или извлеките из Content-Disposition
            a.download = filename;
            
            // Добавляем на страницу и кликаем
            document.body.appendChild(a);
            a.click();
            
            // Очистка
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error("Ошибка скачивания:", error);
            alert("Ошибка при скачивании файла");
        }
    };

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
                                <span className="genre">{book.genre
                                    }</span>
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
                                    onClick={handleDownload}
                                >
                                    Скачать
                                </Btn>
                                
                                <Btn 
                                    className="btn"
                                    onClick={() => navigate(`/book/${book.slug}/read`)}
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