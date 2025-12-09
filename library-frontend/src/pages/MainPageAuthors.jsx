import React from "react";
import HeaderTemplate from "../components/header/HeaderTemplate";
import Profile from "../components/UI/Profile/Profile";
import Btn from "../components/UI/button/Btn";
import { Link } from "react-router-dom";
import Author from "../components/Author/Author";
import AuthorsList from "../components/Author/AuthorsList";


const Elements = [
    {content:<Profile User={{name:"Fedor Sapronov", color:"red"}}/>, divClasses:"col-lg-3 col-md-12"},
    {content:<div>Авторы</div>, divClasses:"col-lg-2 col-md-6 col-12"},
    {content:<Link style={{textDecoration:"none"}} to="/GenresFilter"><Btn>Категории</Btn></Link>, divClasses:"col-lg-2 col-md-6 col-12"},
    {content:<Btn>Группы</Btn>, divClasses:"col-lg-2 col-md-6 col-12"},
    {content:<Link style={{textDecoration:"none"}} to="/MyShell"><Btn>Моя полка</Btn></Link>, divClasses:"col-lg-2 col-md-6 col-12"},
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
    {name:"Василий Георгевич Алексеев", id:24},
]


const MainPageAuthors = () => {
    return(
    <>
        <AuthorsList authors={authorsquery}/>
    </>)
}

export default MainPageAuthors