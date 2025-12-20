import React from "react";
import {apiService} from "../services/api";
export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        const response = await apiService.getG2enres();
        setGenres(response.data);
        setError(null);
      } catch (err) {
        setError('Ошибка при загрузке книг');
        console.error('Ошибка загрузки книг:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  return { genres, loading, error };}