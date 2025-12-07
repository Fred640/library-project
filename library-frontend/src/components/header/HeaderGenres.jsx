import classes from "./Header.module.css"
import Btn from "../UI/button/Btn";
import "./header.css"
import { Link } from "react-router-dom";
import Sel from "../UI/select/Sel";
import Inp from "../UI/input/Inp";

const HeaderGenres = ({searchFunc}) => {



    return(
        <>
        <div className={`container ${classes.mainDiv}`} >
            <div className="row" style={{width:"100%"}}>
                <div className={`col-lg-2 col-sm-6 ${classes.headerButton}`}><Link style={{textDecoration:"none"}} to="/"><Btn>На Главную</Btn></Link></div>
                <div className={`col-lg-3 col-sm-6 ${classes.headerButton}`}>Жанр: <Sel defaultValue={"Любой"} options={[{value:"1", name:"Жанр1"}, {value:"2", name:"Жанр2"}, {value:"3", name:"Жанр3"}, {value:"4", name:"Жанр4"}]}/></div>
                <div className={`col-lg-3 col-sm-6 ${classes.headerButton}`}>Литература: <Sel defaultValue={"Любая"} options={[{value:"Russian", name:"Русская"}, {value:"Foreign", name:"Зарубежная"}]}/></div>
                <div className={`col-lg-3 col-sm-6 ${classes.headerButton}`}>Год выпуска <Inp style={{width:"30%"}}/>-<Inp style={{width:"30%"}} /></div>
                <div className={`col-lg-1 col-sm-6 ${classes.headerButton}`}><Btn>Поиск</Btn></div>
            </div>
        </div>

        
        
        
        </>

    )
}

export default HeaderGenres