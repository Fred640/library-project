import React, { useState } from "react";
import classes from "./Author.module.css"
import { apiService } from '../../services/api.js';
import { Link } from "react-router-dom";

const Author = ({ author, link }) => {
  const nameParts = author.name.split(" ");
  const firstName = nameParts[0] || "";
  const middleName = nameParts[1] || "";
  const surname = nameParts[2] || author.name;
  
  const initials = `${firstName.charAt(0)}. ${middleName.charAt(0)}.`;
  if (link) {
    return (
    <Link to={`/author/${author.slug}/`} className={classes.link}>
    <div className={classes.card} key={author.id}>
        <div className={classes.surname}>
            {surname}
        </div>
        <div className={classes.desktopName}>
            {firstName}<br/>{middleName}
        </div>
        <div className={classes.mobileInitials}>
            {initials}
        </div>
    </div>
    </Link>
    
  );
  } else {
    return (
    <div className={classes.card} key={author.id}>
        <div className={classes.surname}>
            {surname}
        </div>
        <div className={classes.desktopName}>
            {firstName}<br/>{middleName}
        </div>
        <div className={classes.mobileInitials}>
            {initials}
        </div>
    </div>
    
  );
  }
  
}

export default Author

