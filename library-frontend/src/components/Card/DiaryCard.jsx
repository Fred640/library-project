import React from "react";
import { Link } from "react-router-dom";
import classes from './DiaryCard.module.css'
const DiaryCard = ({diary, isCardList}) => {
    if (!isCardList) {
        return(
        <>
        <Link to={`/diary/${diary.slug}/`} className={classes.Link}>
            <div className={classes.card}>
                <div className={classes.username}>{diary.username}</div>
                <div className={classes.title}>{diary.title}</div>
            </div>
        </Link>
        </>
    )
    } else {
            return(
                <Link to={`/diary/${diary.slug}/`} className={classes.Link1}>
                    <div className={classes.card1}>
                        <div className={classes.username1}>{diary.username}</div>
                        <div className={classes.title1}>{diary.title}</div>
                    </div>
                </Link>
            )
    }
    
}

export default DiaryCard