import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAuthors();
        setAuthors(response.data);
        setError(null);
      } catch (err) {
        setError('Ошибка при загрузке авторов');
        console.error('Ошибка загрузки авторов:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, []);

  return { authors, loading, error };
};
// export default useAuthors