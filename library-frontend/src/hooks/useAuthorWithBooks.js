import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useAuthorWithBooks = (authorId) => {
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuthorWithBooks = useCallback(async () => {
    if (!authorId) {
      setError('ID автора не указан');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getAuthorById(authorId);
      
      const authorData = response.data;
      
      if (authorData.books && Array.isArray(authorData.books)) {
        setAuthor({
          id: authorData.id,
          name: authorData.name,
          user_name: author.user_name
        
        });
        setBooks(authorData.books);
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          'Ошибка при загрузке автора';
      setError(errorMessage);
      console.error('Ошибка загрузки автора:', err);
    } finally {
      setLoading(false);
    }
  }, [authorId]);

  useEffect(() => {
    if (authorId) {
      fetchAuthorWithBooks();
    }
  }, [authorId, fetchAuthorWithBooks]);

  return {
    author,
    books,
    loading,
    error,
    refetch: fetchAuthorWithBooks,
  };
};