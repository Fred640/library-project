import {React, useEffect, useState, useMemo} from "react";
import classes from "./ModaleSearch.module.css"
import Inp from "../../../UI/input/Inp";
import Btn from "../../../UI/button/Btn";

const ModalSearch = ({visible, searchFunc, ASvisible}) => {

    const [searchQuery, setSearchQuery] = useState("")

    const searchB = (event) => {
        event.preventDefault()
        const sQ = searchQuery
        searchFunc(sQ)
        
    }

    const render = visible && !ASvisible

    return(
        <>
        {render
        ? <div className={`container ${classes.searchDiv} ${visible ? 'visible' : ''}`}>
            <div className="row">
                <div className="col-5">
                    <Inp placeholder="Введите название книги" 
                    value={searchQuery}
                    onChange={(event)=>{setSearchQuery(event.target.value)}}/>
                </div>
                <div className="col-4">
                    <Btn onClick={searchB}>поиск</Btn>
                </div>
                <button className={`col-3 ${classes.favorite}`}>
                    Избранные
                </button> 
            </div>
        </div>
        : <></>
        }</>
    )
}

export default ModalSearch