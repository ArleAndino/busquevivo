'use client';

import { Box, Paper, Typography } from "@mui/material";

export default function Inicio() {
  return (
    <Box sx={{ padding: 4 }}>
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          🌿 Bienvenido a Bosque Vivo HN
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Esta plataforma digital apoya al Instituto de Conservación Forestal
          (ICF) en la gestión moderna del proceso de permisos, monitoreo satelital,
          trazabilidad de cortas autorizadas y atención de denuncias ambientales.
        </Typography>

        <Typography sx={{ mb: 2 }}>
          El sistema integra herramientas de inteligencia artificial para
          validar identidades, detectar tala ilegal y dar seguimiento al Plan
          de Manejo Forestal en tiempo real.
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Utilice el menú lateral para navegar según su rol y comenzar a operar
          las funciones disponibles.
        </Typography>
      </Paper>
    </Box>
  );
}
