import React from "react";
import classes from "./Genres.modale.css"
import { useGenres } from "../../hooks/useGenres";
const Genres = () => {
    const sliceFunc = (array, size) => {
    const rows = []
    for (let i = 0; i < array.length; i += size) {
      rows.push(array.slice(i, i + size))
    }
    return(rows)
    }
    const {genres, loading, error} = useGenres()
    const g = sliceFunc(genres, 6)

    return(
          <div className="container">
            <div className="row">
              {g.map((row, index) => {
                <div className="col-lg-2 col-md-2 col-sm-4 col-4">
                  <div className={classes.genre}></div>
                </div>
              })}
            </div>
            
          </div>
    )
} 

export default Genres