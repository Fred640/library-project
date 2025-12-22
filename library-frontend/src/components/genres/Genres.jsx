import React from "react";
// import classes from "./Genres.module.css"
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
            {g.map((row, index) => 
              <div className="row justify-content-center"  style={{marginBottom:"7px", marginTop:"7px"}} key={index}> 
                {row.map((genre)=> 
                  <div className="col-lg-2 col-sm-4 col-md-2 col-4" style={{padding:5}}>
                    <div>{genre.cat}</div>
                  </div>)}
              </div>)}
          </div>
    )
} 

export default Genres