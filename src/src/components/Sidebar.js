// src/components/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, IconButton } from '@mui/material';
import { Home as HomeIcon, People as UsersIcon, Settings as SettingsIcon, CalendarToday as CalendarIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Sidebar = ({ open, handleDrawerClose }) => {
  const theme = useTheme();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: theme.spacing(1) }}>
        <IconButton onClick={handleDrawerClose} sx={{ color: '#fff' }}>
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon sx={{ color: '#fff' }}><HomeIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/users">
          <ListItemIcon sx={{ color: '#fff' }}><UsersIcon /></ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button component={Link} to="/settings">
          <ListItemIcon sx={{ color: '#fff' }}><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button component={Link} to="/calendar"> {/* Nova opção de Agenda */}
          <ListItemIcon sx={{ color: '#fff' }}><CalendarIcon /></ListItemIcon>
          <ListItemText primary="Agenda" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
