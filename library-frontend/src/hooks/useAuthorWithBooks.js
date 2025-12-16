import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useAuthorWithBooks = (authorSlug) => {
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authorSlug) {
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
        const response = await apiService.getAuthorBySlug(authorSlug);
        const data = response.data;
        
        setAuthor({
          id: data.id,
          name: data.name,
          slug: data.slug,
          user_name: data.user_name,
        });
        
        setBooks(data.books || []);

      } catch (err) {
        setError('Не удалось загрузить данные');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorSlug]);

  return { author, books, loading, error };
};