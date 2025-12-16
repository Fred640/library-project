import React from "react";
import HeaderTemplate from "../components/header/HeaderTemplate.jsx"
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../styles/pages/BookPage.css'
import useBook from '../hooks/useBook.js'


const BookPage = () => {
    const navigate= useNavigate()
    const params = useParams()
    const {book, loading, error} = useBook(params.book_slug)
    if (loading) { return (
        <>Загрузка</>
    )}
    else {return(
        <div className="MainDiv">
            <div className="BookPageHeader">
                <div>{book.title}</div>
                <div></div>
            </div>
        </div>
    )}
}

export default BookPage