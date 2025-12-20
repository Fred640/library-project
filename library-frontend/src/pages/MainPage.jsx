import {React, useState} from "react";
import HeaderTemplate from "../components/header/HeaderTemplate.jsx"
import Profile from "../components/UI/Profile/Profile.jsx";
import { Link } from "react-router-dom";
import Btn from "../components/UI/button/Btn.jsx";
import CardsList from '../components/Card/CardsList.jsx'
import { useBooks } from "../hooks/useBooks.js";
import { useEffect } from "react";
import Modal from "../components/UI/modal/Modal.jsx";
import Genres from "../components/genres/Genres.jsx";



const MainPage = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const Elements = [
    {content:<Profile User={{name:"Fedor Sapronov", color:"red"}}/>, divClasses:"col-lg-3 col-md-12"},
    {content:<Link to="/authors" style={{textDecoration:"none"}}><Btn>Авторы</Btn></Link>, divClasses:"col-lg-3 col-md-6 col-12"},
    {content:<Btn onClick={() => setModalVisible(true)}>Категории</Btn>, divClasses:"col-lg-3 col-md-6 col-12"},
  ]
  const {books, loading, error} = useBooks()
  const [searchedBooks, setSearchedBooks] = useState([...books])
  
  useEffect(() => {
          if (books.length > 0) {
              setSearchedBooks([...books]);
          }
      }, [books]);
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
        <HeaderTemplate ContainerElements={Elements} searchIclude={true} modaleSearchProps={{placeholder:"Введите название книги", searchFunc:searchBook}}/>
        <CardsList books={searchedBooks} isCardsList={true}/>
        <Modal visble={modalVisible} setVisble={setModalVisible}></Modal>
    </div>
  );
}
export default MainPage