import React, { useState } from "react";
import Btn from "../../../UI/button/Btn";
import classes from "./MAS.module.css"
import Inp from "../../../UI/input/Inp";


const ModaleAuthorSearch = ({visible, searchVisible}) => {

    const [ASQ, setASQ] = useState("")

    let render = visible && !searchVisible

    return(
        
        <>
        {render
        ? <div className={`container ${classes.searchDiv} ${visible ? 'visible' : ''}`}>
            <div className="row">
                <div className="col-5">
                    <Inp placeholder="Введите автора" 
                    value={ASQ}
                    onChange={(event)=>{setASQ(event.target.value)}}/>
                </div>
                <div className="col-4">
                    <Btn>поиск</Btn>
                </div>
                <button className={`col-3 ${classes.favorite}`}>
                    Избранные
                </button>
            </div>
        </div>
        
        : <></>
    }   </>
         
        
         
        
        
    )
}

export default ModaleAuthorSearch