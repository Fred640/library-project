import React from "react";
import classes from "./Inp.module.css"

const Inp = (props) => {
    return(
        <input {...props} className="form-control" >
            {props.children}
        </input>
    )
}

export default Inp