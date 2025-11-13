'use client';

import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import LayoutMenu from './LayoutMenu';
import { usePathname, useRouter } from 'next/navigation';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Estado del menú de perfil
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Rutas donde NO debe aparecer menú ni topbar
  const rutasSinMenu = ['/', '/registro'];

  useEffect(() => {
    const data = localStorage.getItem('bosqueUser');
    if (data) setUser(JSON.parse(data));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('bosqueUser');
    router.push('/');
  };

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const ocultarMenus = rutasSinMenu.includes(pathname) || !user;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Barra Superior */}
      {!ocultarMenus && (
        <AppBar position="fixed" sx={{ zIndex: 2000, backgroundColor: '#63BBD3' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            
            {/* LOGO + Nombre */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img
                src="/escudo.jpg"
                alt="ICF"
                style={{ width: 60, height: 60, borderRadius: 4 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Bosque Vivo HN – Sistema de Permisos y Supervisión Forestal
              </Typography>
            </Box>

            {/* Perfil */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">{user?.name}</Typography>

              <IconButton onClick={handleOpenMenu}>
                <Avatar sx={{ bgcolor: 'green' }}>
                  {user?.name?.substring(0, 1).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
                <MenuItem disabled>{user?.email}</MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>
            </Box>

          </Toolbar>
        </AppBar>
      )}

      {/* Menú lateral */}
      {!ocultarMenus && <LayoutMenu />}

      {/* Contenido Central */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: ocultarMenus ? 0 : 3,
          mt: ocultarMenus ? 0 : '32px',
          ml: ocultarMenus ? 0 : '0px',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
