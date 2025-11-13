"use client";

import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Sidebar({ role }) {
  const router = useRouter();

  const menuByRole = {
    CIUDADANO: [
      { text: "Inicio", path: "/dashboard" },
      { text: "Crear Solicitud", path: "/solicitar-permiso" },
      { text: "Mis Solicitudes", path: "/mis-solicitudes" },
      { text: "Estado del Trámite", path: "/estado" },
    ],

    ICF_LEGAL: [
      { text: "Solicitudes Pendientes", path: "/legal" },
      { text: "Predictamen Geográfico", path: "/legal/predictamen" },
    ],

    ICF_MANEJO: [
      { text: "Solicitudes Aprobadas", path: "/manejo" },
      { text: "Asignar Condiciones", path: "/manejo/condiciones" },
    ],

    ICF_SEGUIMIENTO: [
      { text: "Solicitudes en Ejecución", path: "/seguimiento" },
      { text: "Alertas Satelitales", path: "/mapa" },
    ],

    FEMA: [
      { text: "Alertas Escaladas", path: "/fema" },
    ],

    SERNA: [
      { text: "Reportes Globales", path: "/serna" },
    ],

    ADMIN: [
      { text: "Dashboard General", path: "/admin" },
      { text: "Usuarios", path: "/admin/usuarios" },
      { text: "Auditoría", path: "/admin/auditoria" },
    ],
  };

  const menu = menuByRole[role] || [];

  return (
    <Box sx={{ width: 250, bgcolor: "#e8f5e9", height: "100vh", p: 2 }}>
      <List>
        {menu.map((item, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemButton onClick={() => router.push(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
