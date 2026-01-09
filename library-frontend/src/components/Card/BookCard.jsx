import React from "react";
import classes1 from "./BookCard1.module.css"
import classes2 from './BookCard2.module.css'
import classes3 from './BookCard3.module.css'
import { Link } from "react-router-dom";
import { useFavoriteStatus } from '../../hooks/useFavorites.js'
import { useEffect } from "react";
import { useState } from "react";



const BookCard = ({props, book, isList, isAuthorPage}) => {

    const { checkBookFavoriteStatus } = useFavoriteStatus()
    const [isFavorite, setIsFavorite] = useState(false)
    useEffect(() => {checkBookFavoriteStatus(book.id)}, [])
    useEffect(() => {
        if (book?.id) {
            const fetchFavoriteStatus = async () => {
                try {
                    const result = await checkBookFavoriteStatus(book.id);
                    setIsFavorite(result.is_favorite);
                } catch (error) {
                    console.log(error)
                } finally {
                }
            };
            
            fetchFavoriteStatus()
        }
    }, [book?.id, checkBookFavoriteStatus]);
    const NormalLength = book.title.length > 50
        let title = book.title
        if (NormalLength) {
            title = `${title.substring(0, 40)}...`
        }

        const AuthorName = `${book.author_name.split(" ")[0][0]}.${book.author_name.split(" ")[1][0]}.${book.author_name.split(" ")[2]}`
    
    if (isList) {
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
                    <div className={classes1.heart}>{isFavorite ? <svg className={classes1.heartSVG} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000ff"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg> : ""}</div>
                </div>
            </div>
            </Link>
        )

    } else if (isAuthorPage) {
        return (
            <Link className={classes1.Link} to={`/book/${book.slug}/`}>
                <div className={classes3.card} >
                    <div className={classes3.title}>
                        <div className={classes3.titleText}>
                            {book.title}
                        </div>
                    </div>
                    <div className={classes3.body}>
                    </div>
                </div>
            </Link>
            
        )
    }
        else {
        
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