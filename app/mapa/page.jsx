'use client';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';

// 🚫 Cargamos el mapa dinámicamente SIN SSR
const ForestMap = dynamic(() => import('../components/ForestMap'), {
  ssr: false,
  loading: () => <p style={{ padding: 20 }}>Cargando mapa...</p>,
});

export default function MapaPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
        🗺️ Mapa de Alertas Activas
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Visualización satelital de detecciones automáticas y generación de solicitudes ambientales.
      </Typography>

      <ForestMap />
    </Box>
  );
}
