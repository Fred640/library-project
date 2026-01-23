import {React, useState} from "react";
import HeaderTemplate from "../components/header/HeaderTemplate.jsx"
import Profile from "../components/UI/Profile/Profile.jsx";
import { Link } from "react-router-dom";
import Btn from "../components/UI/button/Btn.jsx";
import CardsList from '../components/Card/CardsList.jsx'
import { useBooks } from "../hooks/useBooks.js";
import { useEffect } from "react";

const MainPage = () => {
  const [modalVisible, setModalVisible] = useState(false)
  
  const {books, loading, error} = useBooks()
  const [selectedGenre, setSelectedGenre] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBooks, setFilteredBooks] = useState([])

  const Elements = [
    {content: <Profile />, divClasses:"col-lg-3 col-md-12"},
    {content:<><Link to={'/users/'} style={{textDecoration:"none"}}><Btn>Авторы</Btn></Link>/<Link style={{textDecoration:"none"}}><Btn>Дневники</Btn></Link></>, divClasses:"col-lg-4 col-md-6 col-12"},
    {content:<><Link to="/authors" style={{textDecoration:"none"}}><Btn>Писатели</Btn></Link>/<Link style={{textDecoration:"none"}}><Btn isActive={true}>Книги</Btn></Link></>, divClasses:"col-lg-4 col-md-6 col-12"},
  ]


  


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
    const toggleGenresModal = () => {
    setModalVisible(!modalVisible);
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
        genresInclude={true}
        GenresProps={{onGenreSelect:handleGenreSelect}}
        modaleGenresProps={{
          visible: modalVisible,
          onClose: () => setModalVisible(false),
          onOpen: () => setModalVisible(true)
        }}
      />
      <CardsList books={filteredBooks} isCardsList={true}/>
    </div>
  );
}

export default MainPage;