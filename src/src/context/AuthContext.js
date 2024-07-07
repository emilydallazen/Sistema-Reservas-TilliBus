// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import useToken from '../components/useToken';

// Cria o contexto
const AuthContext = createContext();

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Provedor de contexto
export const AuthProvider = ({ children }) => {
  const { token, setToken, removeToken } = useToken();
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/login', credentials);
      const token = response.data.token;

      // Armazena o token
      setToken(token);
      setIsAuthenticated(true);

      // Configura o axios para enviar o token em todas as requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error; // Re-throw the error to handle it in the LoginPage
    }
  };

  const logout = async () => {
    // Remove o token
    removeToken();
    setIsAuthenticated(false);
    // Remove o cabeçalho de autorização do axios
    delete axios.defaults.headers.common['Authorization'];
  };

  // Configura o axios com o token ao carregar o componente
  React.useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
