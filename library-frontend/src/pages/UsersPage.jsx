import React from "react";
import HeaderTemplate from "../components/header/HeaderTemplate";
import Profile from "../components/UI/Profile/Profile";
import { Link } from "react-router-dom";
import Btn from "../components/UI/button/Btn";
import UsersList from "../components/Author/UserList";
import { useState, useEffect } from "react";
import { useStaffUsers } from "../hooks/useStaffUsers";
import { useStaffFavorite } from '../hooks/useStaffFavorite';


const UsersPage = () => {
    const Elements = [
    {content: <Profile />, divClasses:"col-lg-3 col-md-12"},
    {content:<><Link style={{textDecoration:"none"}}><Btn isActive={true}>Авторы</Btn></Link>/<Link to={'/diaries'} style={{textDecoration:"none"}}><Btn>Дневники</Btn></Link></>, divClasses:"col-lg-4 col-md-6 col-12"},
    {content:<><Link to="/authors" style={{textDecoration:"none"}}><Btn>Писатели</Btn></Link>/<Link to={'/'} style={{textDecoration:"none"}}><Btn >Книги</Btn></Link></>, divClasses:"col-lg-4 col-md-6 col-12"},
    ]
    const {users, loading, error} = useStaffUsers()
    const [searchedUsers, setSearchedUsers] = useState([...users])
    useEffect(() => {
            if (users.length > 0) {
                setSearchedUsers([...users]);
            }
        }, [users]);
    const searchUsers = (sq) => {
        setSearchedUsers(users.filter((user) => {
            if (sq) {
                return (user.username.includes(sq))
            } else {return (users)}
        }))
    }
    if (loading) {
        return(
        <>
        <HeaderTemplate 
        searchIclude={true}
        ContainerElements={Elements}
        modaleSearchProps={{
          placeholder:"Введите имя пользователя",
          searchFunc:searchUsers
        }}
        />
        <div>Загрузка</div>
        </>
        )
    } else {
    return(
        <>
        <HeaderTemplate 
        searchIclude={true}
        ContainerElements={Elements}
        modaleSearchProps={{
          placeholder:"Введите имя пользователя",
          searchFunc:searchUsers
        }}
        />
        <UsersList users={searchedUsers}/>
        </>
    )}
}

export default UsersPage