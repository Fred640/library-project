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
            <button className={` dropdowntoogle ${isOpen ? classes.open : ""}`} onClick={change}>
                {title} {isOpen ? "▼" : "▶"}
            </button>

            <div ref={contentRef} className={`dropdownContent ${isopen ? classes.open : ""}`}>
                {children}
            </div>
        </div>
    )
}

export default List