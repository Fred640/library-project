import React from "react";
import classes from "./Header.module.css"
const HeaderTemplate = ({aside}, {ContainerElements}) => {
    return(
        <>
            <div className={`container ${classes.mainDiv}`}>
                <div className="row">
                    {ContainerElements.map((element) => {
                    <div className={element.getClasses}>{element.content}</div>
                })}
                </div>
            </div>
        </>
    )
}

export default HeaderTemplate