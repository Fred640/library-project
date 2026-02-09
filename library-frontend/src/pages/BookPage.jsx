import HeaderTemplate from "../components/header/HeaderTemplate.jsx";
import { useParams, useNavigate, Link } from "react-router-dom";
import Btn from "../components/UI/button/Btn";
import Profile from "../components/UI/Profile/Profile";
import "../styles/pages/BookPage.css";
import { useBook } from '../hooks/useBook.js';
import BookCard from "../components/Card/BookCard.jsx";
import { useBookFavorite } from '../hooks/useFavorites.js';

const BookPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { book, loading: bookLoading, error } = useBook(params.book_slug);
    
    const { 
        isFavorite, 
        toggleFavorite, 
        loading: favoriteLoading,
        error: favoriteError,
        initialized
    } = useBookFavorite(book?.id);

    

    const Elements = [
        {
            content: <Profile/>,
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
        }
    };

    if (bookLoading) {
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

    const getFavoriteButtonText = () => {
        if (favoriteLoading) return "Загрузка...";
        if (favoriteError) return "Ошибка";
        if (!initialized) return "Проверка...";
        return isFavorite ? "Удалить из избранного" : "Добавить в Избранное";
    };

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
                        <span onClick={() => navigate(`/author/${book.author_slug}/`)}>{book.author_name}</span>
                        <span> / </span>
                        <span className="current">{book.title}</span>
                    </div>

                    {favoriteError && (
                        <div className="alert alert-warning">
                            Ошибка: {favoriteError.message || favoriteError}
                        </div>
                    )}

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
                                
                                <Btn 
                                    className="btn"
                                    onClick={toggleFavorite}
                                    disabled={favoriteLoading || !initialized}
                                >
                                    {getFavoriteButtonText()}
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