import React from "react";
import classes from "../styles/ProfilePage.module.css"
import { useLocation } from "react-router";
import Btn from "../components/UI/button/Btn";
import { useNavigate } from "react-router";
import List from "../components/UI/list/List";
import CardsList from "../components/Card/CardsList";
import { useState } from "react";


const ProfilePage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const User = location.state

    const [books, setBooks] = useState([
      {title:"Гроза", author:"Островский", genre:"Драмма", id: 1},
      {title:"Евгений Онегин", author:"Пушкин", genre:"роман", id: 2},
      {title:"Грозаф", author:"Островский", genre:"Драмма", id: 3},
      {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 4},
      {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 5},
      {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 6}])


    return(
        <>
            <div className={classes.HeaderDiv}>
                <Btn onClick={() => {navigate("/")}}>На главную</Btn>
                <div className={classes.userNameDiv}>{User.name}</div>
                <div style={{backgroundColor:`${User.color}`}} className={classes.Avatar}>{String(User.name)[0]}</div>
            </div>
            <div className={classes.bodyDiv}>
                <List title={"Избранные"}>
                    <List title={"Книги"}><CardsList books={books}/></List>
                    <List title={"Авторы"}></List>
                    
                </List>     
            </div>
        </>
        

        
    )
}

export default ProfilePage