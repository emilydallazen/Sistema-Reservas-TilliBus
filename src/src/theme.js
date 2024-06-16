// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b6e4e', // Cor principal
    },
    secondary: {
      main: '#b3e3c0', // Cor secundária
    },
    background: {
      default: '#f5f2ed', // Cor de fundo
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Altere para a fonte desejada
  },
});

export default theme;
