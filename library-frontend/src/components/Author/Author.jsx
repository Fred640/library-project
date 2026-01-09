import React, { useState } from "react";
import classes from "./Author.module.css"
import { apiService } from '../../services/api.js';
import { Link } from "react-router-dom";
import { useFavoriteStatus } from '../../hooks/useFavorites.js'
import { useEffect } from "react";

const Author = ({ author, link }) => {
    const {checkAuthorFavoriteStatus} = useFavoriteStatus()
    const [isFavorite, setIsFavorite] = useState(false)
    useEffect(() => {
        if (author?.id) {
            const fetchAuthor = async () => {
                try {
                    const data = await checkAuthorFavoriteStatus(author.id)
                    setIsFavorite(data.is_favorite)
                } catch (error) {
                    console.log(error)
                } finally {
                    
                }
            };
            fetchAuthor()
        }
    }, [checkAuthorFavoriteStatus, author?.id])
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
            <span className={classes.star}>{isFavorite ? <svg className={classes.starSVG} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg> : ""}</span>
        </div>
        <div className={classes.mobileInitials}>
            {initials}
            <span className={classes.star}>{isFavorite ? <svg className={classes.starSVG} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg> : ""}</span>
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
            <span className={classes.star}>{isFavorite ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg> : ""}</span>
            
        </div>
        <div className={classes.mobileInitials}>
            {initials}
            <span className={classes.star}>{isFavorite ? <svg className={classes.starSVG} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg> : ""}</span>
        </div>
        <div></div>
    </div>
    
  );
  }
  
}

export default Author

