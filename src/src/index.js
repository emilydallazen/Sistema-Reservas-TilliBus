// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme'; 
import { AuthProvider } from './context/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={darkTheme}> {}
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
