// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A262F', // Cor principal
    },
    secondary: {
      main: '#e3e1de', // Cor secundária
    },
    background: {
      default: '#FAF9F6', // Cor de fundo
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Altere para a fonte desejada
  },
});

export default theme;
