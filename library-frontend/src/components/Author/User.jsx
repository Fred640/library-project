import React from "react";
import classes from './User.module.css'
import { Link } from "react-router-dom";
const User = ({user}) => {
    return(
        <>
        <Link to={`/user/${user.username}`} className={classes.link}>
            <div className={classes.mainDiv}>
                <div className={classes.content}>
                    <div className={classes.lineDiv}>
                        <div className={classes.name}>{user.first_name}</div>
                        <div className={classes.name}>{user.last_name}</div>
                        <div className={classes.username}>{user.username}</div>
                        <span className={classes.star}><svg className={classes.starSVG} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg></span>
                    </div>
                </div>    
            </div>
        </Link>
        </>
    )
}
export default User