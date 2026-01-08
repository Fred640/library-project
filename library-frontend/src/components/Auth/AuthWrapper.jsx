import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';

const AuthWrapper = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const currentPath = location.pathname;
      
      if (currentPath === '/reg' || currentPath === '/login') {
        setIsChecking(false);
        return;
      }
      
      if (!token) {
        navigate('/reg', { replace: true });
        setIsChecking(false);
        return;
      }
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return children;
};

export default AuthWrapper;