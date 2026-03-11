import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useAnonymousLogin = () => {
  const { signInAnonymously } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    try {
      await signInAnonymously();
      navigate('/games'); // Redireciona para a página de jogos após login anônimo
    } catch (error) {
      console.error('Erro no login anônimo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleAnonymousLogin,
    isLoading
  };
}; 