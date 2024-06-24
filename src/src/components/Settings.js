// src/components/Settings.js
import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Container, Box } from '@mui/material';

const Settings = () => {
  return (
    <div>
      <Navbar />
      <Box display="flex">
        <Sidebar />
        <Container>
          <h1>Configurações</h1>
          <p>Aqui será o menu para algumas configurações.</p>
        </Container>
      </Box>
    </div>
  );
};

export default Settings;
