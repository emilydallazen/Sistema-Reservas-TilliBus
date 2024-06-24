// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { AccountCircle, Menu } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Navbar = ({ toggleDrawer, isDrawerOpen }) => {
  const theme = useTheme();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggleDrawer}
          sx={{ marginRight: 2 }}
        >
          {isDrawerOpen ? <Menu /> : <Menu />}
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema Admin
        </Typography>
        <IconButton color="inherit">
          <AccountCircle/>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
