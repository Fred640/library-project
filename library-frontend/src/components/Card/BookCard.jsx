import React from "react";
import classes1 from "./BookCard1.module.css"
import classes2 from './BookCard2.module.css'
import { Link } from "react-router-dom";



const BookCard = ({props, book, isList}) => {
    if (isList) {
        const NormalLength = book.title.length > 50
        let title = book.title
        if (NormalLength) {
            title = `${title.substring(0, 40)}...`
        }

        const handleAuthorClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        navigate(`/author/${book.author_slug}`);
        };

        const AuthorName = `${book.author_name.split(" ")[0][0]}.${book.author_name.split(" ")[1][0]}.${book.author_name.split(" ")[2]}`
        return(
            <Link to={`/book/${book.slug}/`} className={classes1.Link}>
            <div className={classes1.card} >
                <div className={classes1.title}>
                    <div className={classes1.titleText}>
                        {title}
                    </div>
                </div>
                <div className={classes1.body}>
                    <div className={classes1.param}><span style={{fontWeight:700}}>Автор:</span><span to={`/author/${book.author_slug}/`}>{AuthorName}</span></div>
                    <div className={classes1.param}><span style={{fontWeight:700}}>Жанр:</span> {book.genre}</div>
                </div>
            </div>
            </Link>
        )
    } else {
        
        return(
            <div className={classes2.card} >
                <div className={classes2.title}>
                    <div className={classes2.titleText}>
                        {book.title}
                    </div>
                </div>
                <div className={classes2.body}>
                </div>
            </div>
        )
    }
    
}

export default BookCard