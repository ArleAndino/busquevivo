'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';

export default function MisSolicitudes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('solicitudes') || '[]');
    const user = JSON.parse(localStorage.getItem('bosqueUser')).email;

    setData(all.filter(s => s.ciudadano === user));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
        📄 Mis Solicitudes
      </Typography>

      {data.map((sol) => (
        <Card key={sol.id} sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">{sol.id} – {sol.tipo}</Typography>
            <Typography><b>Ubicación:</b> {sol.ubicacion}</Typography>
            <Typography><b>Fecha:</b> {sol.fecha}</Typography>
            <Chip label={sol.estado} sx={{ mt: 1 }} color="primary" />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
