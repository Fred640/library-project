import HeaderTemplate from "../components/header/HeaderTemplate.jsx";
import { useParams, useNavigate, Link } from "react-router-dom";
import Btn from "../components/UI/button/Btn";
import Profile from "../components/UI/Profile/Profile";
import "../styles/pages/BookPage.css";
import { useDiary } from '../hooks/useDiary.js';
import DiaryCard from '../components/Card/DiaryCard.jsx'
import { useDiaryFavorite } from "../hooks/useFavorites.js";

const DiaryPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { diary, loading, error } = useDiary(params.diary_slug);
    const { 
            isFavorite, 
            toggleFavorite, 
            loading: favoriteLoading,
            error: favoriteError,
            initialized
        } = useDiaryFavorite(diary?.id);

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
        if (diary && diary.download_url) {
            window.open(diary.download_url, '_blank');
        } else {
            console.error("URL для скачивания не найден");
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
                    <p>{error.message || error.error || String(error)}</p>
                    <Btn onClick={() => navigate(-1)}>Вернуться назад</Btn>
                </div>
            </>
        );
    }

    if (!diary) {
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

    if (loading) {
        return (
            <>
                <HeaderTemplate 
                    ContainerElements={Elements} 
                />
                <div className="book-page-loading">
                    <div className="loading-spinner"></div>
                    <p>Загрузка дневника...</p>
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
                    <p>{error.message || error.error || String(error)}</p>
                    <Btn onClick={() => navigate(-1)}>Вернуться назад</Btn>
                </div>
            </>
        );
    }

    if (!diary) {
        return (
            <>
                <HeaderTemplate 
                    ContainerElements={Elements} 
                />
                <div className="book-page-not-found">
                    <h2>Дневник не найден</h2>
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
                        <span onClick={() => navigate("/diaries")}>Дневники</span>
                        <span> / </span>
                        <span className="current">{diary.title}</span>
                    </div>

                    <div className="book-main-info">
                        <div className="book-cover">
                            <DiaryCard diary={diary}/>
                        </div>
                        <div className="book-details">
                            <div className="book-author">
                                <span className="label">Автор: </span>
                                <span className="author-link">
                                    {`${diary.username}, ${diary.user_first_name} ${diary.user_last_name}`}
                                </span>
                            </div>
                            
                            <div className="book-title">
                                <h1>{diary.title}</h1>
                            </div>
                            
                            
                            {diary.description && (
                                <div className="">
                                    <h3>Описание</h3>
                                    <p>{diary.description}</p>
                                </div>
                            )}
                            
                            
                            <div className="book-actions">
                                <Btn 
                                    className="btn"
                                    onClick={() => navigate(`${diary.download_url}`)}
                                >
                                    Скачать
                                </Btn>
                                <Btn className="btn" onClick={toggleFavorite}>
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

export default DiaryPage;