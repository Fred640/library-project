import React from "react";
import classes from "./Inp.module.css"

const Inp1 = (props) => {
    return(
        <input {...props} className={classes}>
            {props.children}
        </input>
    )
}

export default Inp1