import {React, useState} from "react";
import "./header.css"
import classes from "./Header.module.css"
import Btn from "../UI/button/Btn";

import ModalSearch from "./search/Books Search/ModaleSearch";
import {Link} from "react-router-dom"
import Profile from "../UI/Profile/Profile";

const Header = ({searchFunc}) => {

    const [search, setSearch] = useState(false)

    return(
        <>
        <div className={`container ${classes.mainDiv}`} >
            <button className={classes.searchButton} onClick={() => {
                    setSearch(!search)
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" fill="#000000ff" viewBox="0 -960 960 960">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                </svg>
            </button>
            <div className="row" style={{width:"70%"}}>
                <div className="col-lg-3 col-md-12">
                    <Profile User={{name:"Fedor Sapronov", color:"red"}}/>
                </div>
                <div className={`col-lg-3 col-md-6 col-12 ${classes.headerButton}`}>
                    <Link to="/authors" style={{textDecoration:"none"}}><Btn>Авторы</Btn></Link>
                </div>
                <div className={`col-lg-3 col-md-6 col-12 ${classes.headerButton}`}>
                    <Link style={{textDecoration:"none"}} to="/GenresFilter"><Btn>Категории</Btn></Link>
                </div>
            </div>
        </div>
        <ModalSearch visible={search} searchFunc={searchFunc} placeholder={"Введите название книги"}/>
        </>

    )
}

export default Header