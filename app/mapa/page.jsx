'use client';
import { Box, Typography } from '@mui/material';
import ForestMap from '../components/ForestMap';

export default function Mapa() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
        🗺️ Mapa de Alertas Activas
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Visualización de las detecciones automáticas de tala ilegal en territorio nacional.
      </Typography>
      <ForestMap />
    </Box>
  );
}
