import React from "react";
import classes from "./BookCard.module.css"


const BookCard = ({props, book}) => {
    return(
        <div className={classes.card} >
            <div className={classes.title}>
                <div className={classes.titleText} >{book.title}</div>
            </div>
            <div className={classes.body}>
                <div className={classes.param}>Автор: {book.author}</div>
                <div className={classes.param}>Жанр: {book.genre}</div>
            </div>
        </div>
    )
}

export default BookCard