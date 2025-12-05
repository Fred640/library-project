import React from "react";
import classes  from "./Sel.module.css"

const Sel = ({props, options, defaultValue, value}) => {
    return(
        <div>
            <select className="form-select" value={value}>
                <option >{defaultValue}</option>
                {options.map((o) => <option className={classes.mySel} key={o.value} value={o.value}>{o.name}</option>)}
            </select>
        </div>
    )
}

export default Sel