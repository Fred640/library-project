import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useBook = (BookSlug) => {
  const [book, setBook] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (!BookSlug) {
      setBook(null);
      setError('Нет ID автора');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.getBook(BookSlug);
        const data = response.data;
        
        setBook({
          id: data.id,
          title: data.title,
          genre: data.genre,
          slug: data.slug,
          author_name: data.author_name,
          author_slug: data.author_slug,


        });
        

      } catch (err) {
        setError('Не удалось загрузить данные');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BookSlug]);

  return { book, loading, error };
};

export default useBook