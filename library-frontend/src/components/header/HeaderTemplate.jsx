import React from "react";
import classes from "./Header.module.css"
import ModalSearch from "./search/Books Search/ModaleSearch";
import { useState } from "react";
import "./header.css"
const HeaderTemplate = ( {ContainerElements, searchIclude, modaleSearchProps}) => {

    const [search, setSearch] = useState(false)

    return(
        <>
            <div className={`container ${classes.mainDiv}`}>
               {searchIclude ?
                    <button className={classes.searchButton} onClick={() => {
                            setSearch(!search)
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" fill="#000000ff" viewBox="0 -960 960 960">
                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                        </svg>
                    </button>
                :<></>}
                <div className="row" style={{width:"70%"}}>
                    {ContainerElements.map((element, index) => (
                    <div className={`${element.divClasses} ${classes.headerButton}`} key={index}>{element.content}</div>
                    ))}
                </div>
            </div>
            {searchIclude ? <ModalSearch visible={search} {...modaleSearchProps}/>
            : <></>}
        </>
    )
}

export default HeaderTemplate