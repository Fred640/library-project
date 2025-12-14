import React from "react";
import classes from "./BookCard.module.css"
import { Link } from "react-router-dom";

const BookCard = ({props, book}) => {
    const NormalLength = book.title.length > 50
    let title = book.title
    if (NormalLength) {
        title = `${title.substring(0, 40)}...`
    }

    const AuthorName = `${book.author_name.split(" ")[0][0]}.${book.author_name.split(" ")[1][0]}.${book.author_name.split(" ")[2]}`
    return(
        <div className={classes.card} >
            <div className={classes.title}>
                <div className={classes.titleText}>
                    {title}
                </div>
            </div>
            <div className={classes.body}>
                <div className={classes.param}><span style={{fontWeight:700}}>Автор:</span> <Link to={`/author/${book.author_id}/`}>{AuthorName}</Link></div>
                <div className={classes.param}><span style={{fontWeight:700}}>Жанр:</span> {book.genre}</div>
            </div>
        </div>
    )
}

export default BookCard