import React, { useContext, useEffect } from "react";
import classes from "./Genres.module.css"
import { useGenres } from "../../hooks/useGenres";
import { ModalContext } from '../context/ModalContext.jsx';
import { useState } from "react";
import Btn from '../UI/button/Btn.jsx'

const Genres = ({ onGenreSelect }) => {
    const sliceFunc = (array, size) => {
        const rows = []
        for (let i = 0; i < array.length; i += size) {
            rows.push(array.slice(i, i + size))
        }
        return(rows)
    }
    
    const {genres, loading, error} = useGenres()
    const g = sliceFunc(genres, 6)

    const context = useContext(ModalContext)
    const [selectedGenre, setSelectedGenre] = useState("")
    
    const handleGenreClick = (genreSlug) => {
        if (onGenreSelect) {
            onGenreSelect(genreSlug);
        }
    }
    
    return(
        <div className={`container ${classes.mainDiv}`}>
          <Btn onClick={() => handleGenreClick("")} className="allButton">Все</Btn>
            {g.map((row, index) => 
                <div className="row justify-content-center" style={{marginBottom:"7px", marginTop:"7px"}} key={index}> 
                    {row.map((genre) => 
                        <div className={`col-lg-4 col-sm-4 col-md-2 col-4`} style={{padding:5}} key={genre.id}>
                            <Btn 
                                className={classes.genreName} 
                                onClick={() => handleGenreClick(genre.cat)}
                            >
                                {genre.cat}
                            </Btn>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 

export default Genres;