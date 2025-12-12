import React, { useState } from "react";
import HeaderTemplate from "../components/header/HeaderTemplate";
import Profile from "../components/UI/Profile/Profile";
import Btn from "../components/UI/button/Btn";
import { Link } from "react-router-dom";
import Author from "../components/Author/Author";
import AuthorsList from "../components/Author/AuthorsList";
import ModalSearch from "../components/header/search/Books Search/ModaleSearch";
import classes from "../components/header/Header.module.css"
import { useEffect } from "react";
import fetchAuthors from "../services/api";
import { useAuthors } from "../hooks/useAuthors";


const MainPageAuthors = () => {

    const Elements = [
    {content:<Profile User={{name:"Fedor Sapronov", color:"red"}}/>, divClasses:"col-lg-3 col-md-12"},
    {content:<Link to="/" style={{textDecoration:"none"}}><Btn>Книги</Btn></Link>, divClasses:"col-lg-3 col-md-6 col-12"},
    {content:<Link style={{textDecoration:"none"}} to="/GenresFilter"><Btn>Фильтры</Btn></Link>, divClasses:"col-lg-3 col-md-6 col-12"},
]

const aside = <button className={classes.searchButton} onClick={
  () => {setSearch(!search)}
}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" fill="#000000ff" viewBox="0 -960 960 960">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                </svg>
            </button>



const [search, setSearch] = useState(false)
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
        <HeaderTemplate aside={aside} ContainerElements={Elements}/>
        <ModalSearch placeholder={'Введите имя автора'} searchFunc={searchAuthors} visible={search}/>
        <AuthorsList authors={searchedAuthors}/>

    </>)
}

export default MainPageAuthors