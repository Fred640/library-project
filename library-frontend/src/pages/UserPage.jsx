import React from "react";
import '../styles/pages/AuthorPage.css'
import { useParams } from 'react-router-dom';
import { useUser } from "../hooks/useUser";
import HeaderTemplate from "../components/header/HeaderTemplate";
import Profile from "../components/UI/Profile/Profile";
import Btn from "../components/UI/button/Btn";
import DiaryCardList from "../components/Card/DiaryCardList";
import { useNavigate } from "react-router-dom";
import User from "../components/Author/User";
import { useSingleStaffFavorite } from '../hooks/useStaffFavorite';

const UserPage = () => {
    const params = useParams()
    const navigate = useNavigate()
    const {user, diaries, error} = useUser(params.username)
    
    const { 
        isFavorite, 
        loading: favoriteLoading, 
        toggleFavorite 
    } = useSingleStaffFavorite(user?.id);

    const Elements = [
        {content:<Profile/>, divClasses:"col-lg-3 col-md-12"},
        {content:<Btn onClick={()=>{navigate(-1)}}>Назад</Btn>, divClasses:"col-lg-3 col-md-6 col-12"},
    ]

    const handleToggleFavorite = async () => {
        try {
            await toggleFavorite();
        } catch (error) {
            console.error("Ошибка:", error);
        }
    }

    return(
        <>
            <HeaderTemplate 
                ContainerElements={Elements} 
            />
            
            <div className="author-page-container">
                <div className="author-page-content">
                    <div className="breadcrumbs">
                        <span onClick={() => navigate("/")}>Главная</span>
                        <span> / </span>
                        <span onClick={() => navigate("/users")}>Авторы</span>
                        <span> / </span>
                        <span>{user?.username}</span>
                        <span> / </span>
                    </div>

                    <div className="author-main-info">
                        <div className="author-cover">
                            <User isUserPage={true} user={user}/>
                        </div>
                        <div className="author-details">
                            <div className="author-actions">
                                <Btn 
                                    className="btn" 
                                    onClick={handleToggleFavorite}
                                    disabled={favoriteLoading}
                                >
                                    {favoriteLoading ? "..." : 
                                     (isFavorite ? "Удалить из избранного" : "Добавить в избранное")}
                                </Btn>
                            </div>
                            <DiaryCardList diaries={diaries} isCardList={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserPage