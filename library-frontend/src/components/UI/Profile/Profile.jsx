import React from "react";
import classes from "./Profile.module.css"
import { useNavigate } from "react-router-dom";

const Profile = ({User}) => {
    
    const navigate = useNavigate()
    const color = User.color
    const name = User.name

    return(
        <div className={classes.profileDiv}>
                <button onClick={() => {navigate("/Profile", {state:{...User}})}} style={{backgroundColor:`${User.color}`}} className={classes.Avatar}>{String(User.name)[0]}</button>
                <button onClick={() => {navigate("/Profile", {state:{...User}})}} className={classes.nickname}>{User.name}</button>
        </div>
    )
}

export default Profile