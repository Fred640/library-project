import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import classes from './DiaryCard.module.css'
import { useFavoriteStatus } from "../../hooks/useFavorites";
const DiaryCard = ({diary, isCardList}) => {
    const [isFavorite, setIsFavorite] = useState(false)
    const {checkDiaryFavoriteStatus} = useFavoriteStatus()
    useEffect(() => {
        
        if (diary?.id) {
            const fetchFavoriteStatus = async () => {
                try {
                    const result = await checkDiaryFavoriteStatus(diary.id)
                    setIsFavorite(result.is_favorite) 
                } catch (error) {
                    console.log(error)
                }
            }
            fetchFavoriteStatus()
        }
    }, [diary.id, checkDiaryFavoriteStatus])


    if (!isCardList) {
        return(
        <>
        <Link to={`/diary/${diary.slug}/`} className={classes.Link}>
            <div className={classes.card}>
                <div className={classes.username}>{diary.username}</div>
                <div className={classes.title}>{diary.title}</div>
                <div className={classes.heart}>{isFavorite ? <svg className={classes.heartSVG} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000ff"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg> : ""}</div>
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