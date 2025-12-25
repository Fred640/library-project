import React from "react";
import BookCard from "./BookCard";

const CardsList = ({books, isCardsList, isAuthorPage}) => {
  const sliceFunc = (array, size) => {
    const rows = []
    for (let i = 0; i < books.length; i += size) {
      rows.push(array.slice(i, i + size))
    }
    return(rows)
  }

  const b = sliceFunc(books, 6)

  return(
      <div className="container">
        {b.map((row, index) => 
          <div className="row justify-content-center"  style={{marginBottom:"7px", marginTop:"7px"}} key={index}> {row.map((book)=> 
            <div className="col-lg-2 col-sm-4 col-md-2 col-4" style={{padding:5}}>
              <BookCard isList={isCardsList} book={book} key={book.id} isAuthorPage={isAuthorPage}/>
            </div>)}
          </div>)}
      </div>
    )
  }




export default CardsList