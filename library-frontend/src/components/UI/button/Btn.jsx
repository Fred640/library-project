import React from "react";
import classes from "./Btn.module.css";
import classesActive from "./BtnActive.module.css";

const Btn = ({ isActive, ...props }) => {
    return isActive ? (
        <button className={classesActive.MyBtn} {...props}>
            {props.children}
        </button>
    ) : (
        <button className={classes.MyBtn} {...props}>
            {props.children}
        </button>
    );
};

export default Btn;