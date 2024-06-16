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
          <h1>Settings</h1>
          <p>Configure your settings here.</p>
        </Container>
      </Box>
    </div>
  );
};

export default Settings;
