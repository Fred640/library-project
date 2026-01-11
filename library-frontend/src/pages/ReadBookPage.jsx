import React, { useState, useEffect } from "react";
import { useBookContent } from "../hooks/useBookContent.js";
import { useParams, useNavigate } from "react-router-dom";
import useBook from "../hooks/useBook.js";
import "../styles/pages/ReadBookPage.css";
import Btn from '../components/UI/button/Btn.jsx';

const ReadBookPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { book, loading: bookLoading } = useBook(params.book_slug);
    const { content, loading: contentLoading } = useBookContent(book?.download_url);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [fontSize, setFontSize] = useState(18);
    const [pages, setPages] = useState([]);
    
    useEffect(() => {
        if (content) {
            const wordsPerPage = 400;
            const words = content.split(/\s+/);
            const newPages = [];
            
            for (let i = 0; i < words.length; i += wordsPerPage) {
                const pageWords = words.slice(i, i + wordsPerPage);
                let pageText = pageWords.join(' ');
                
                if (pageText.includes('## ') && !pageText.includes('##\n')) {
                    const headingMatch = pageText.match(/## [^#]+/g);
                    if (headingMatch) {
                        const lastHeading = headingMatch[headingMatch.length - 1];
                        if (!lastHeading.includes('##')) {
                            const headingIndex = pageText.lastIndexOf('## ');
                            pageText = pageText.substring(0, headingIndex);
                            i -= (pageWords.length - pageText.split(/\s+/).length);
                        }
                    }
                }
                
                newPages.push(pageText);
            }
            
            setPages(newPages);
            
            const saved = localStorage.getItem(`page_${params.book_slug}`);
            if (saved && parseInt(saved) <= newPages.length) {
                setCurrentPage(parseInt(saved));
            }
        }
    }, [content, params.book_slug]);
    
    const splitByParagraphs = (text) => {
        if (!text) return [];
        const paragraphs = text.split(/\n\s*\n/);
        const newPages = [];
        let currentPageText = '';
        let currentWordCount = 0;
        const targetWordsPerPage = 300;
        
        for (const paragraph of paragraphs) {
            const paragraphWords = paragraph.split(/\s+/).length;
            
            if (currentWordCount + paragraphWords > targetWordsPerPage && currentPageText) {
                newPages.push(currentPageText.trim());
                currentPageText = paragraph + '\n\n';
                currentWordCount = paragraphWords;
            } else {
                currentPageText += paragraph + '\n\n';
                currentWordCount += paragraphWords;
            }
        }
        
        if (currentPageText.trim()) {
            newPages.push(currentPageText.trim());
        }
        
        return newPages;
    };
    
    useEffect(() => {
        if (currentPage > 0) {
            localStorage.setItem(`page_${params.book_slug}`, currentPage.toString());
        }
    }, [currentPage, params.book_slug]);
    
    const goToNextPage = () => {
        if (currentPage < pages.length) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };
    
    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };
    
    const goToPage = (pageNum) => {
        if (pageNum >= 1 && pageNum <= pages.length) {
            setCurrentPage(pageNum);
            window.scrollTo(0, 0);
        }
    };
    
    useEffect(() => {
        if (content) {
            const newPages = splitByParagraphs(content);
            setPages(newPages);
            
            const saved = localStorage.getItem(`page_${params.book_slug}`);
            if (saved && parseInt(saved) <= newPages.length) {
                setCurrentPage(parseInt(saved));
            }
        }
    }, [content, params.book_slug]);
    
    if (bookLoading || contentLoading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Загрузка книги...</p>
            </div>
        );
    }
    
    return (
        <div className="reader">
            <div className="reader-controls">
                <div className="font-controls">
                    <Btn
                        onClick={() => setFontSize(f => Math.max(14, f - 2))}
                        title="Уменьшить шрифт"
                    >
                        A-
                    </Btn>
                    <span className="font-size">{fontSize}px</span>
                    <Btn
                        onClick={() => setFontSize(f => Math.min(28, f + 2))}
                        title="Увеличить шрифт"
                    >
                        A+
                    </Btn>
                </div>
                <div>
                    <Btn onClick={() => {
                        navigate(-1)
                    }}>На страницу книги</Btn>
                </div>
                
                <div className="page-info">
                    <span>Страница {currentPage} из {pages.length}</span>
                </div>
            </div>
            
            <div className="reader-content">
                <div 
                    className="text-content"
                    style={{ fontSize: `${fontSize}px` }}
                >
                    {pages[currentPage - 1] ? (
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            {pages[currentPage - 1]}
                        </div>
                    ) : (
                        "Страница не найдена"
                    )}
                </div>
            </div>
            
            <div className="reader-nav">
                <Btn 
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                >
                    ← Назад
                </Btn>
                
                <div className="page-jump">
                    <span>Страница:</span>
                    <input
                        value={currentPage}
                        onChange={(e) => setCurrentPage(e.target.value)}
                        className="page-input"
                    />
                    <span>/ {pages.length}</span>
                </div>
                
                <Btn 
                    onClick={goToNextPage}
                    disabled={currentPage === pages.length}
                >
                    Вперёд →
                </Btn>
            </div>
        </div>
    );
};

export default ReadBookPage;