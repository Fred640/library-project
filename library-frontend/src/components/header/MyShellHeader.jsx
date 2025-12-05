import classes from "./header.module.css"
import Btn from "../UI/button/Btn";
import "./header.css"
import { Link } from "react-router-dom";
import Sel from "../UI/select/Sel";
import Inp from "../UI/input/Inp";
import Profile from "../UI/Profile/Profile";
import ModalSearch from "./search/Books Search/ModaleSearch";
import { useState } from "react";

const MyShellHeader = ({searchFunc}) => {

    const [search, setSearch] = useState(false)

    return(
        <>
        <div className={`container ${classes.mainDiv}`} >
            <div className="row" style={{width:"100%"}}>
                <div className={`col-lg-2 col-sm-6 ${classes.headerButton}`}><Link style={{textDecoration:"none"}} to="/"><Btn>На Главную</Btn></Link></div>
                <div className={`col-lg-2 col-sm-6 ${classes.headerButton}`}><Profile User={{name:"Fedor Sapronov"}}/></div>
                <div className={`col-lg-2 col-sm-6 ${classes.headerButton}`}><Btn onClick={()=> {if(search) {setSearch(false)} else {setSearch(true);}}}>Поиск</Btn></div>
            </div>
        </div>
        <ModalSearch visible={search} searchFunc={searchFunc}/>
        </>

    )
}

export default MyShellHeader