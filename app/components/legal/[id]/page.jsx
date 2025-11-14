"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent,TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Cargar mapa dinámicamente
const MiniMap = dynamic(() => import('./mini-map'), { ssr: false });

export default function SolicitudLegalPage({ params }) {
  const router = useRouter();
  const resolved = React.use(params); // desenvuelve la Promise
  const id = resolved.id;
const [observacion, setObservacion] = useState("");
  const [solicitud, setSolicitud] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("solicitudes");
    if (stored) {
      const data = JSON.parse(stored);
      const found = data.find((s) => s.id === id);
      setSolicitud(found);
    }
  }, [id]);

  const actualizarEstadoold = (nuevoEstado) => {
    const stored = JSON.parse(localStorage.getItem("solicitudes"));
    const updated = stored.map((s) =>
      s.id === id ? { ...s, estado: nuevoEstado } : s
    );
    localStorage.setItem("solicitudes", JSON.stringify(updated));
    alert(`Estado actualizado a: ${nuevoEstado}`);
    router.push('/legal');
  };

  const actualizarEstado = (nuevoEstado, observacion = "") => {
  const user = JSON.parse(localStorage.getItem("bosqueUser"));

  const stored = JSON.parse(localStorage.getItem("solicitudes"));
  const updated = stored.map((s) => {
    if (s.id === id) {
      return {
        ...s,
        estado: nuevoEstado,
        track: [
          ...(s.track || []),
          {
            fecha: new Date().toISOString(),
            estado: nuevoEstado,
            observacion,
            usuario: user?.email || "TÉCNICO ICF"
          }
        ]
      };
    }
    return s;
  });

  localStorage.setItem("solicitudes", JSON.stringify(updated));
  alert(`Estado actualizado a: ${nuevoEstado}`);
  router.push('/legal');
};


  if (!solicitud) {
    return <Typography>Cargando solicitud...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
        📄 Revisión Legal de Solicitud {solicitud.id}
      </Typography>

      <Card sx={{ mb: 3, backgroundColor: '#e8f5e9' }}>
        <CardContent>
          <Typography><b>Ciudadano:</b> {solicitud.ciudadano}</Typography>
          <Typography><b>Fecha:</b> {solicitud.fecha}</Typography>
          <Typography><b>Tipo:</b> {solicitud.tipo}</Typography>
          <Typography><b>Estado:</b> {solicitud.estado}</Typography>
        </CardContent>
      </Card>

      {/* Mapita del polígono */}
      {solicitud.polygon1 && (
        <MiniMap geojson={solicitud.polygon} />
      )}
<Card sx={{ mb: 3, p: 2, backgroundColor: "#fffde7" }}>
  <Typography variant="h6" sx={{ mb: 2 }}>
    📄 Documentos Presentados
  </Typography>

  {solicitud.documentos.length === 0 && (
    <Typography>No se adjuntaron documentos.</Typography>
  )}

  {solicitud.documentos.map((doc, i) => (
    <Card
      key={i}
      sx={{
        p: 1,
        mb: 1,
        backgroundColor: "#fff",
        borderLeft: "5px solid #1b5e20",
      }}
    >
      <Typography>{doc}</Typography>

      <Button
        size="small"
        variant="outlined"
        sx={{ mt: 1 }}
        onClick={() => alert("Simulando descarga de " + doc)}
      >
        Descargar
      </Button>
    </Card>
  ))}
</Card>



<TextField
  label="Observación"
  fullWidth
  multiline
  rows={3}
  value={observacion}
  onChange={(e) => setObservacion(e.target.value)}
  sx={{ mb: 2 }}
/>
      {/* Botones de gestión */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
       <Button
  variant="contained"
  color="success"
  onClick={() => actualizarEstado("PREDICTAMEN GEOGRAFICO", observacion)}
>
  Enviar a Predictamen Geográfico
</Button>

<Button
  variant="contained"
  color="warning"
  onClick={() => actualizarEstado("INCOMPLETA", observacion)}
>
  Regresar por Requisitos
</Button>

<Button
  variant="contained"
  color="error"
  onClick={() => actualizarEstado("RECHAZADA", observacion)}
>
  Rechazar Solicitud
</Button>

      </Box>
    </Box>
  );
}
