import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Settings from './components/Settings';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MyCalendar from './components/MyCalendar'; 

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Router>
      <CssBaseline />
      <Navbar toggleDrawer={toggleDrawer} isDrawerOpen={isDrawerOpen} />
      <Box sx={{ display: 'flex' }}>
        <Sidebar open={isDrawerOpen} handleDrawerClose={toggleDrawer} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px', marginLeft: isDrawerOpen ? '240px' : '60px', transition: 'margin 0.3s' }}>
          <Toolbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/Agenda" element={
              <ProtectedRoute>
                <MyCalendar />
              </ProtectedRoute>
            } />
            
            <Route path="/Cadastros" element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
            
            <Route path="/Dashboard" element={
              <ProtectedRoute> 
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/Config" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
