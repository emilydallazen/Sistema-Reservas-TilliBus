// src/components/Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Navbar = ({ toggleDrawer, toggleTheme, isDarkMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useAuth(); // use logout from the auth context

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    // handle settings logic here
  };

  const handleLogout = async () => {
    try {
      // Make the logout request to the backend
      await axios.post('/logout');
      // Call the logout function from the context
      logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleDrawer}
          sx={{ marginRight: 3 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema Admin
        </Typography>
        <IconButton
          color="inherit"
          onClick={toggleTheme}
          sx={{ marginLeft: 1.5 }}
        >
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <IconButton
          color="inherit"
          onClick={handleMenuOpen}
          sx={{ marginLeft: 1 }}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleSettings}>
            Configurações
          </MenuItem>
          <MenuItem onClick={handleLogout} style={{ color: 'red' }}>
            Deslogar
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
