import React from "react";
import {useDiaries} from '../hooks/useDiaries.js'
import DiaryCardList from '../components/Card/DiaryCardList.jsx'
import { useState, useEffect } from "react";
import HeaderTemplate from '../components/header/HeaderTemplate.jsx'
import Profile from '../components/UI/Profile/Profile.jsx'
import Btn from '../components/UI/button/Btn.jsx'
import { Link } from "react-router-dom";
const DiariesPage = () => {
    const {diaries, loading, error} = useDiaries()
    const [searchedDiaries, setSearchedDiaries] = useState([...diaries])
    useEffect(() => {
        if (diaries.length > 0) {
            setSearchedDiaries([...diaries])
        }
    }, [diaries])

    const searchDiary = (sq) => {
        setSearchedDiaries(diaries.filter((diary) => {
            if (sq) {
                return (diary.title.includes(sq))
            } else {
                return diaries
            }
        }))
    }

    const Elements = [
    {content: <Profile />, divClasses:"col-lg-3 col-md-12"},
    {content:<><Link to={'/users/'} style={{textDecoration:"none"}}><Btn>Авторы</Btn></Link>/<Link style={{textDecoration:"none"}}><Btn isActive={true}>Дневники</Btn></Link></>, divClasses:"col-lg-4 col-md-6 col-12"},
    {content:<><Link to="/authors" style={{textDecoration:"none"}}><Btn>Писатели</Btn></Link>/<Link style={{textDecoration:"none"}}><Btn>Книги</Btn></Link></>, divClasses:"col-lg-4 col-md-6 col-12"},
  ]
    return(
        <>
        <HeaderTemplate ContainerElements={Elements} searchIclude={true} modaleSearchProps={{placeholder:"Введите нащвание дневника", searchFunc:searchDiary}}/>
            <DiaryCardList diaries={searchedDiaries}/>
        </>
    )
}

export default DiariesPage