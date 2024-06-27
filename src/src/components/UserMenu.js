// src/components/UserMenu.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../context/AuthContext';

const UserMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/Config');
  };

  return (
    <div>
      <IconButton onClick={handleMenuOpen} color="inherit">
        <Avatar />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleSettings}>
          <SettingsIcon fontSize="small" />
          Configurações
        </MenuItem>
        <MenuItem onClick={handleLogout} style={{ color: 'red' }}>
          <ExitToAppIcon fontSize="small" />
          Deslogar
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
