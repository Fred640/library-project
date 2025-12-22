import React from "react";
import {apiService} from "../services/api";
import { useState, useEffect } from "react";
export const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        const response = await apiService.getGenres();
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