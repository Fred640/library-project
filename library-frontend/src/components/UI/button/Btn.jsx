import React from "react";
import classes from "./Btn.module.css"
const Btn = (props) => {
    return(
        <button className={classes.MyBtn} {...props}>
            {props.children}
        </button>
    )
}

export default Btn