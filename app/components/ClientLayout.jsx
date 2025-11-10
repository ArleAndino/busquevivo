'use client';
import { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import Link from 'next/link';

const drawerWidth = 240;

export default function ClientLayout({ children }) {
  const [menu] = useState([
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Mapa de Alertas', path: '/mapa' },
    { name: 'Solicitudes', path: '/solicitudes' },
    { name: 'Denuncias', path: '/denuncias' },
    { name: 'Bitácora', path: '/bitacora' }
  ]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: '#1b5e20' }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            🌳 Bosque Vivo HN
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {menu.map((item, index) => (
            <ListItem key={index} component={Link} href={item.path}>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, mt: '64px' }}>
        {children}
      </Box>
    </Box>
  );
}
