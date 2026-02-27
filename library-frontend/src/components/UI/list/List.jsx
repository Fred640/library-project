import React from "react";
import classes from "./List.module.css"
import { useState, useRef } from "react";

const List = ({title, children}) => {
    const contentRef = useRef(null)
    const [isOpen, setIsOpen] = useState(true)
    const change = () => {
        setIsOpen(!isOpen)
    }

    return(
        <div className={classes.dropdownList}>
            <button className={`${classes.dropdownToogle} ${isOpen ? classes.open : ""}`} onClick={change}>
                {title} <div className={classes.svgContainer}>{isOpen ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-360 280-560h400L480-360Z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-280v-400l200 200-200 200Z"/></svg>}</div>
            </button>

            <div ref={contentRef} className={`${classes.dropdownContent} ${isOpen ? classes.open : ""}`}>
                {children}
            </div>
        </div>
    )
}

export default List;