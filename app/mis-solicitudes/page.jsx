'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';

export default function MisSolicitudes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('solicitudes') || '[]');
    const user = JSON.parse(localStorage.getItem('bosqueUser')).email;

    const propias = all.filter(s => s.ciudadano === user);
    setData(propias);
  }, []); 

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
        📄 Mis Solicitudes
      </Typography>

      {data.map((sol) => (
        <Card key={sol.id} sx={{ mt: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6">{sol.id} – {sol.tipo}</Typography>
            <Typography><b>Ubicación:</b> {sol.ubicacion}</Typography>
            <Typography><b>Fecha:</b> {sol.fecha}</Typography>

            <Chip 
              label={sol.estado} 
              sx={{ mt: 1, fontWeight: "bold" }} 
              color="primary" 
            />

            {/* 📌 HISTORIAL DE ESTADOS */}
            <Card sx={{ mt: 4, p: 2, backgroundColor: "#f9fbe7" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                📌 Historial de la Solicitud
              </Typography>

              {/* Si no hay track, mostrar mensaje */}
              {(!sol.track || sol.track.length === 0) && (
                <Typography color="text.secondary">
                  No hay movimientos registrados aún.
                </Typography>
              )}

              {/* Historial */}
              {sol.track && sol.track.map((t, i) => (
                <Card 
                  key={i} 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: "#e8f5e9", 
                    borderLeft: "5px solid #4caf50" 
                  }}
                >
                  <Typography>
                    <b>Fecha:</b> {new Date(t.fecha).toLocaleString()}
                  </Typography>
                  <Typography>
                    <b>Estado:</b> {t.estado}
                  </Typography>
                  <Typography>
                    <b>Usuario:</b> {t.usuario}
                  </Typography>
                  <Typography>
                    <b>Observación:</b> {t.observacion || "—"}
                  </Typography>
                </Card>
              ))}
            </Card>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
