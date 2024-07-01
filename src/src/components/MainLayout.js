// src/components/MainLayout.js
import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ isDrawerOpen, toggleDrawer, toggleTheme, isDarkMode }) => {
  return (
    <>
      <CssBaseline />
      <Navbar
        toggleDrawer={toggleDrawer}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode} 
        isDrawerOpen={isDrawerOpen}
      />
      <Box sx={{ display: 'flex' }}>
        <Sidebar open={isDrawerOpen} handleDrawerClose={toggleDrawer} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: '64px',
            marginLeft: isDrawerOpen ? '240px' : '60px',
            transition: 'margin 0.3s',
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;
