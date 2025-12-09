import React from "react";
import classes from "./BookCard.module.css"


const BookCard = ({props, book}) => {
    const NormalLength = book.title.length > 30
    let title = book.title
    if (NormalLength) {
        title = `${title.substring(0, 25)}...`
    }
    return(
        <div className={classes.card} >
            <div className={classes.title}>
                <div className={classes.titleText}>
                    {title}
                </div>
            </div>
            <div className={classes.body}>
                <div className={classes.param}>Автор: {book.author}</div>
                <div className={classes.param}>Жанр: {book.genre}</div>
            </div>
        </div>
    )
}

export default BookCard