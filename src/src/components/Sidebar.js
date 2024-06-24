// src/components/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, IconButton } from '@mui/material';
import { Assessment as AssessmentIcon, AttachMoney as AttachMoneyIcon, Settings as SettingsIcon, CalendarToday as CalendarIcon, ChevronLeft, ChevronRight, Create as CreateIcon } from '@mui/icons-material';
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
        width: 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 190,
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
        <ListItem button component={Link} to="/Agenda">
          <ListItemIcon sx={{ color: '#fff' }}><CalendarIcon /></ListItemIcon>
          <ListItemText primary="Agenda" />
        </ListItem>
        <ListItem button component={Link} to="/Cadastros">
          <ListItemIcon sx={{ color: '#fff' }}><CreateIcon /></ListItemIcon>
          <ListItemText primary="Cadastros" />
        </ListItem>
        <ListItem button component={Link} to="/Financeiro">
          <ListItemIcon sx={{ color: '#fff' }}><AttachMoneyIcon /></ListItemIcon>
          <ListItemText primary="Financeiro" />
        </ListItem>
        <ListItem button component={Link} to="/Dashboard">
          <ListItemIcon sx={{ color: '#fff' }}><AssessmentIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/Config">
          <ListItemIcon sx={{ color: '#fff' }}><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Configurações" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
