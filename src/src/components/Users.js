// src/components/Users.js
import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Container, Box } from '@mui/material';

const Users = () => {
  return (
    <div>
      <Navbar />
      <Box display="flex">
        <Sidebar />
        <Container>
          <h1>Users</h1>
          <p>Aqui será a aba de cadastros.</p>
        </Container>
      </Box>
    </div>
  );
};

export default Users;
