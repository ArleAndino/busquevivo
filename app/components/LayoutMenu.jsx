'use client';

import { Drawer, List, ListItem, ListItemText, Toolbar, ListItemButton } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

const drawerWidth = 250;

export default function LayoutMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('bosqueUser');
    if (data) setUser(JSON.parse(data));
  }, []);

  if (!user) return null;

  const menuPorRol = {
    ADMIN: [
      { name: "Inicio", path: "/inicio" },
      { name: "Dashboard", path: "/dashboard" },
      { name: "Alertas", path: "/mapa" },
      { name: "Solicitudes", path: "/solicitudes" },
      { name: "Denuncias", path: "/denuncias" },
      { name: "Bitácora", path: "/bitacora" },
    ],

    ICF_TECNICO: [
      { name: "Inicio", path: "/inicio" },
      { name: "Solicitudes", path: "/legal" },
      { name: "Mapa de Alertas", path: "/mapa" }
    ],

    CIUDADANO: [
      { name: "Inicio", path: "/inicio" },
      { name: "Solicitar Permiso", path: "/solicitar-permiso" },
      { name: "Mis Solicitudes", path: "/mis-solicitudes" },
      { name: "Alertas", path: "/mapa" }
    ],

    ICF_TECNICO_GEO: [
      { name: "Inicio", path: "/inicio" },
      { name: "Revisión geográfica", path: "/geografico" },      // listado geográfico
      { name: "Mapa de Alertas", path: "/mapa" },
      { name: "Solicitudes", path: "/solicitudes" }              // opcional
    ],

    FEMA: [
      { name: "Inicio", path: "/inicio" },
      { name: "Denuncias", path: "/denuncias" },
      { name: "Mapa de Alertas", path: "/mapa" }
    ],
    ICF_MANEJO: [
  { name: "Inicio", path: "/inicio" },
  { name: "Planes de Manejo", path: "/manejo" },      // listado que hicimos
  
  { name: "Mapa de Alertas", path: "/mapa" }          // opcional
],
  };

  const items = menuPorRol[user.role] || [];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#63BBD3",
          color: "#fff"
        }
      }}
    >
      <Toolbar />
      <List>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              sx={{ color: "white" }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
