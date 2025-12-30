import React from "react";
import { useBookContent } from "../hooks/useBookContent.js";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useBook from "../hooks/useBook.js";
const ReadBookPage = () => {
    const params = useParams()
    const { book, loading, error } = useBook(params.book_slug);
    
    const navigate = useNavigate()
    const { content, loadingContent, errorContent } = useBookContent(book.download_url)
    return (
        <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
    )
}

export default ReadBookPage