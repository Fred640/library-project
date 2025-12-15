import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useAuthorWithBooks = (authorId) => {
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authorId) {
      setAuthor(null);
      setBooks([]);
      setError('Нет ID автора');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.getAuthorById(authorId);
        const data = response.data;
        
        // ДАННЫЕ ЕСТЬ - УСТАНАВЛИВАЕМ АВТОРА И КНИГИ
        setAuthor({
          id: data.id,
          name: data.name,
          user_name: data.user_name,
        });
        
        // books гарантированно есть в вашем ответе
        setBooks(data.books || []);

      } catch (err) {
        setError('Не удалось загрузить данные');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorId]);

  return { author, books, loading, error };
};