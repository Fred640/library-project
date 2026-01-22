import React, { useState } from "react";
import HeaderTemplate from "../components/header/HeaderTemplate";
import Profile from "../components/UI/Profile/Profile";
import Btn from "../components/UI/button/Btn";
import { Link } from "react-router-dom";
import AuthorsList from "../components/Author/AuthorsList";
import { useEffect } from "react";
import { useAuthors } from "../hooks/useAuthors";


const MainPageAuthors = () => {
    const Elements = [
    {content: <Profile />, divClasses:"col-lg-3 col-md-12"},
    {content:<><Link  style={{textDecoration:"none"}}><Btn>Авторы</Btn></Link>/<Link style={{textDecoration:"none"}}><Btn>Дневники</Btn></Link></>, divClasses:"col-lg-4 col-md-6 col-12"},
    {content:<><Link to="/authors" style={{textDecoration:"none"}}><Btn isActive={true}>Писатели</Btn></Link>/<Link to={'/'} style={{textDecoration:"none"}}><Btn>Книги</Btn></Link></>, divClasses:"col-lg-4 col-md-6 col-12"},
  ]

const { authors, loading, error } = useAuthors()
const [searchedAuthors, setSearchedAuthors] = useState([...authors])
useEffect(() => {
        if (authors.length > 0) {
            setSearchedAuthors([...authors]);
        }
    }, [authors]);
const searchAuthors = (sq) => {
    setSearchedAuthors(authors.filter((author) => {
        if (sq) {
            return (author.name.includes(sq))
        } else {return (authors)}
    }))
}


    return(
    <>
        <HeaderTemplate ContainerElements={Elements} searchIclude={true} modaleSearchProps={{placeholder:"Введите имя автора", searchFunc:searchAuthors}}/>
        <AuthorsList authors={searchedAuthors} isCardLink={true}/>
    </>)
}

export default MainPageAuthors