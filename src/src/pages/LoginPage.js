// src/pages/LoginPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, TextField, Container, Box } from '@mui/material';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    login();
    navigate('/Agenda'); // Redireciona para a agenda após o login
  };

  return (
    <Container>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <img src="/tilli-logo.png" alt="Tilli Logo" style={{ marginBottom: 20, width: 200 }} />
        <TextField
          label="Usuário"
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
