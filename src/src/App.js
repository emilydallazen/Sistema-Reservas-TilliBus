// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Settings from './components/Settings';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import MyCalendar from './components/MyCalendar'; 
import Financeiro from './components/Financeiro'; 
import MainLayout from './components/MainLayout';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
          </ProtectedRoute>
        }>
          <Route path="Agenda" element={<MyCalendar />} />
          <Route path="Cadastros" element={<Users />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Config" element={<Settings />} />
          <Route path="Financeiro" element={<Financeiro />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
