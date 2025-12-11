import React, { useState } from "react";
import HeaderTemplate from "../components/header/HeaderTemplate";
import Profile from "../components/UI/Profile/Profile";
import Btn from "../components/UI/button/Btn";
import { Link } from "react-router-dom";
import Author from "../components/Author/Author";
import AuthorsList from "../components/Author/AuthorsList";
import ModalSearch from "../components/header/search/Books Search/ModaleSearch";
import classes from "../components/header/Header.module.css"


const MainPageAuthors = () => {

    const Elements = [
    {content:<Profile User={{name:"Fedor Sapronov", color:"red"}}/>, divClasses:"col-lg-3 col-md-12"},
    {content:<Link to="/" style={{textDecoration:"none"}}><Btn>Книги</Btn></Link>, divClasses:"col-lg-3 col-md-6 col-12"},
    {content:<Link style={{textDecoration:"none"}} to="/GenresFilter"><Btn>Фильтры</Btn></Link>, divClasses:"col-lg-3 col-md-6 col-12"},
]


let authorsquery = [
    {name:"Василий Георгевич Алексеев", id:1},
    {name:"Василий Георгевич Алексеев", id:2},
    {name:"Василий Георгевич Алексеев", id:3},
    {name:"Василий Георгевич Алексеев", id:4},
    {name:"Василий Георгевич Алексеев", id:5},
    {name:"Василий Георгевич Алексеев", id:6},
    {name:"Василий Георгевич Алексеев", id:7},
    {name:"Василий Георгевич Алексеев", id:8},
    {name:"Василий Георгевич Алексеев", id:9},
    {name:"Василий Георгевич Алексеев", id:10},
    {name:"Василий Георгевич Алексеев", id:11},
    {name:"Василий Георгевич Алексеев", id:12},
    {name:"Василий Георгевич Алексеев", id:13},
    {name:"Василий Георгевич Алексеев", id:14},
    {name:"Василий Георгевич Алексеев", id:15},
    {name:"Василий Георгевич Алексеев", id:16},
    {name:"Василий Георгевич Алексеев", id:17},
    {name:"Василий Георгевич Алексеев", id:18},
    {name:"Василий Георгевич Алексеев", id:19},
    {name:"Василий Георгевич Алексеев", id:20},
    {name:"Василий Георгевич Алексеев", id:21},
    {name:"Василий Георгевич Алексеев", id:22},
    {name:"Василий Георгевич Алексеев", id:23},
    {name:"Агарзаев Василий", id:24},
]

const aside = <button className={classes.searchButton} onClick={() => {
                    setSearch(!search)
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" fill="#000000ff" viewBox="0 -960 960 960">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                </svg>
            </button>


const [searchedAuthors, setSearchedAuthors] = useState([...authorsquery])

const [search, setSearch] = useState(false)


  const searchAuthors = (sQ) => {
    setSearchedAuthors(authorsquery.filter(author => {
      if(sQ) {
        return(author.name.includes(sQ))
      } else {
        return(authorsquery)
        
      }
    }))
  }

    return(
    <>
        <HeaderTemplate aside={aside} ContainerElements={Elements}/>
        <ModalSearch searchFunc={searchAuthors} placeholder={'Введите имя автора'} visible={search}/>
        <AuthorsList authors={searchedAuthors} />

    </>)
}

export default MainPageAuthors