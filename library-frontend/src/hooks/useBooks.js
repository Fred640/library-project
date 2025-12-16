import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const response = await apiService.getBooks();
        setBooks(response.data);
        setError(null);
      } catch (err) {
        setError('Ошибка при загрузке книг');
        console.error('Ошибка загрузки книг:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  return { books, loading, error };
};