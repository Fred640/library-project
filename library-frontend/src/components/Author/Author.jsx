import React from "react";
import classes from "./Author.module.css"

const Author = ({ author }) => {
  const nameParts = author.name.split(" ");
  const firstName = nameParts[0] || "";
  const middleName = nameParts[1] || "";
  const surname = nameParts[2] || author.name;
  
  const initials = `${firstName.charAt(0)}. ${middleName.charAt(0)}.`;
  
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

export default Author