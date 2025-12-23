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
  const [selectedGenre, setSelectedGenre] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBooks, setFilteredBooks] = useState([])
  


  useEffect(() => {
    if (books.length === 0) return;
    
    let result = [...books];
    
    if (selectedGenre) {
      result = result.filter(book => book.genre === selectedGenre);
    }
    
    if (searchQuery) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredBooks(result);
    
  }, [books, selectedGenre, searchQuery]);

  useEffect(() => {
    if (books.length > 0) {
      setFilteredBooks([...books]);
    }
  }, [books]);



    const handleGenreSelect = (genreSlug) => {
        setSelectedGenre(genreSlug);
        setModalVisible(false);
        console.log("Selected genre in MainPage:", genreSlug);
    }
  
    const searchBook = (sQ) => {
    setSearchQuery(sQ);
  }

    

  return (
    <div className="App">
      <HeaderTemplate 
        ContainerElements={Elements} 
        searchIclude={true} 
        modaleSearchProps={{
          placeholder:"Введите название книги", 
          searchFunc:searchBook
        }}
      />
      <CardsList books={filteredBooks} isCardsList={true}/>
      
      <Modal 
        visible={modalVisible} 
        setVisible={setModalVisible}
      >
        <Genres onGenreSelect={handleGenreSelect}/>
      </Modal>
    </div>
  );
}

export default MainPage;