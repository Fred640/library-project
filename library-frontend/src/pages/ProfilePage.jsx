import React, { useEffect, useState } from "react";
import Btn from "../components/UI/button/Btn";
import { useNavigate } from "react-router-dom";
import { useFavoriteBooks, useFavoriteAuthors, useFavoriteDiaries } from '../hooks/useFavoriteItems.js'
import List from "../components/UI/list/List.jsx";
import CardsList from '../components/Card/CardsList.jsx'
import AuthorsList from '../components/Author/AuthorsList.jsx'
import Headertemplate from '../components/header/HeaderTemplate.jsx'
import Profile from '../components/UI/Profile/Profile.jsx'
import { useAuth } from "../components/context/AuthContext";
import DiaryCardList from "../components/Card/DiaryCardList.jsx";
import { useStaffFavorite } from '../hooks/useStaffFavorite.js'
import UserList from '../components/Author/UserList.jsx'
import { useUser } from "../hooks/useUser.js";
const ProfilePage = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { books, fetchBooks, refreshBooks } = useFavoriteBooks();
    const { authors, fetchAuthors, refreshAuthors } = useFavoriteAuthors();
    const { favoriteDiaries, fetchDiaries, refreshDiaries} = useFavoriteDiaries();
    const [pageLoading, setPageLoading] = useState(true);
    const { favoriteStaff } = useStaffFavorite()
    const { diaries } = useUser(user?.username)
    useEffect(() => {
        if (!authLoading) {
            const timer = setTimeout(() => {
                setPageLoading(false);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [authLoading]);
    
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            console.log('❌ Не авторизован, перенаправляем на регистрацию');
            navigate('/reg/');
        }
    }, [isAuthenticated, authLoading, navigate]);
    
    const logoutClick = (event) => {
        event.preventDefault();
        logout(); 
        navigate('/reg/');
    }

    if (authLoading || pageLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Загрузка профиля...</div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column'
            }}>
                <div style={{ marginBottom: '20px' }}>Вы не авторизованы</div>
                <Btn onClick={() => navigate('/reg/')}>Войти / Зарегистрироваться</Btn>
            </div>
        );
    }
    
    if (!user) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Ошибка загрузки данных пользователя</div>
            </div>
        );
    }

    const Elements = [
        { content: <Btn onClick={() => { navigate(-1) }}>Назад</Btn>, divClasses: "col-lg-3 col-md-6 col-12" },
        { content: <Profile />, divClasses: "col-lg-3 col-md-12" },
        { content: <Btn onClick={logoutClick}>Выйти</Btn>, divClasses: "col-lg-3 col-md-6 col-12" },
    ];
    
    return (
        <>
            <Headertemplate ContainerElements={Elements} searchIclude={false} />
            <List title={"Избранные книги"}>
                <CardsList books={books} isCardsList={true} />
            </List>
            <List title={'Избранные писатели'} >
                <AuthorsList authors={authors} isCardLink={true} />
            </List>
            <List title={'Избранные дневники'}>
                <DiaryCardList diaries={favoriteDiaries}/>
            </List>
            <List title={'Избранные авторы'}>
                <UserList users={favoriteStaff}/>
            </List>
            <div>
                {user.is_staff ? 
                    <>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize:20,
                            fontWeight:600,
                        }}>
                            Вы автор
                        </div>
                        <div style={{display:"flex", justifyContent:"center", margin:30}}>
                            <Btn onClick={() => { navigate('/diary/create') }}>Выложить Дневник</Btn>
                        </div>
                        
                        <List title={'Ваши дневники'}>
                            <DiaryCardList diaries={diaries}/>
                        </List>
                    </>
                    :
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Btn onClick={() => navigate('/AuthorReg')}>Стать автором</Btn>
                    </div>
                }
            </div>
        </>
    );
}

export default ProfilePage;