import React from "react";
import classes from "./Header.module.css"
const HeaderTemplate = ( {ContainerElements}) => {
    return(
        <>
            <div className={`container ${classes.mainDiv}`}>
                <div className="row" style={{width:"70%"}}>
                    {ContainerElements.map((element, index) => (
                    <div className={` ${element.divClasses} ${classes.headerButton}`} key={index}>{element.content}</div>
                ))}
                </div>
            </div>
        </>
    )
}

export default HeaderTemplate