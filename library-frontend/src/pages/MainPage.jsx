import {React, useState} from "react";
import Header from "../components/header/Header";
import CardsList from "../components/Card/CardsList";



const MainPage = () => {
  const [books, setBooks] = useState([
  {title:"Гроза", author:"Островский", genre:"Драмма", id: 1},
  {title:"Евгений Онегин", author:"Пушкин", genre:"роман", id: 2},
  {title:"Грозаф", author:"Островский", genre:"Драмма", id: 3},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 4},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 5},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 6},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 7},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 8},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 9},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 10},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 11},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 12},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 13},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 14},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 15},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 16},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 17},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 18},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 19},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 20},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 21},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 22},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 23},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 24},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 25},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 26},
  {title:"Герой нашего времени", author:"Лермонтов", genre:"роман", id: 27},
  ])

  const [searchedBooks, setSearchedBooks] = useState([...books])

  const searchBook = (sQ) => {
    setSearchedBooks(books.filter(book => {
      if(sQ) {
        return(book.title.includes(sQ))
        
      } else {
        return(books)
        
      }
       return(books)
    }))
  }

  
  return (
    <div className="App">
        <Header searchFunc={searchBook}/>
        <CardsList books={searchedBooks}/>

    </div>
  );
}
export default MainPage