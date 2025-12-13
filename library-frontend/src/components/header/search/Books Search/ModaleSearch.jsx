import {React, useEffect, useState, useMemo} from "react";
import classes from "./ModaleSearch.module.css"
import Inp from "../../../UI/input/Inp";
import Btn from "../../../UI/button/Btn";

const ModalSearch = ({visible, ...props}) => {
    const [searchQuery, setSearchQuery] = useState("")
    const searchA = (event) => {
        event.preventDefault()
        const SQ = searchQuery
        props.searchFunc(SQ)

    }

    return(
        <>
        {visible
        ? <div className={`container ${classes.searchDiv} `}>
            <div className="row">
                <div className="col-8">
                    <Inp placeholder={props.placeholder}
                    value={searchQuery}
                    onChange={(event)=>{setSearchQuery(event.target.value)}}/>
                </div>
                <div className="col-4">
                    <Btn onClick={searchA}>поиск</Btn>
                </div> 
            </div>
        </div>
        : <></>
        }</>
    )
}

export default ModalSearch