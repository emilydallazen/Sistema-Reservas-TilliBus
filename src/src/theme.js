// src/theme.js
import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#1A262F', 
    },
    secondary: {
      main: '#e3e1de',
    },
    background: {
      default: '#FAF9F6',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1A262F', 
    },
    secondary: {
      main: '#1A262F',
    },
    background: {
      default: '#0f0f0f', // cor de fundo
      paper: '#1A262F', // cor de fundo para os components
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});


export { lightTheme, darkTheme };
