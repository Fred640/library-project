import React from "react";
import classes from "./Inp.module.css"

const Inp = ({id, label, type, value, onChange, ...props}) => {
    return(
        <div className="form-floating mb-3">
            <input 
                id={id} 
                className="form-control"
                type={type}
                value={value}
                onChange={onChange}
                placeholder={label}
                {...props}
            />
            <label htmlFor={id}>{label}</label>
        </div>
    )
}

export default Inp;