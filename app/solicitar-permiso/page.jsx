'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import {
  Box, Stepper, Step, StepLabel, Button, Typography,
  TextField, MenuItem, Card, CardContent, Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';

// Mapa con Leaflet Draw (dinámico)
const DrawMap = dynamic(() => import('./map/DrawMap'), { ssr: false });

export default function SolicitarPermiso() {
  const router = useRouter();

  const steps = [
    "Datos del permiso",
    "Dibujar polígono",
    "Subir documentos",
    "Revisión final"
  ];

  const [activeStep, setActiveStep] = useState(0);

  // Datos
  const [tipo, setTipo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Mapa
  const [polygon, setPolygon] = useState(null);

  // Documentos
  const [docs, setDocs] = useState([]);

  const [error, setError] = useState('');

  // Manejo de documentos
  const handleDocs = (e) => {
    const files = Array.from(e.target.files);
    setDocs(files.map(f => f.name));
  };

  // Guardar solicitud
  const handleSubmit = () => {
    if (!polygon) {
      setError("Debe dibujar un polígono.");
      return;
    }

    if (docs.length === 0) {
      setError("Debe subir los documentos obligatorios.");
      return;
    }

    const user = JSON.parse(localStorage.getItem('bosqueUser'));

    const stored = JSON.parse(localStorage.getItem('solicitudes') || '[]');

    const nueva = {
      id: "SOL-" + Date.now(),
      tipo,
      ubicacion,
      descripcion,
      polygon,
      documentos: docs,
      fecha: new Date().toISOString().split('T')[0],
      estado: "ENVIADA",
      ciudadano: user.email,
       track: [
    {
      fecha: new Date().toISOString(),
      estado: "ENVIADA",
      observacion: "Solicitud creada por el ciudadano",
      usuario: user.email
    }
  ]
    };

    stored.push(nueva);
    localStorage.setItem('solicitudes', JSON.stringify(stored));

    setActiveStep(steps.length);
    setTimeout(() => router.push('/mis-solicitudes'), 2000);
  };

  const handleNext = () => {
    if (activeStep === 0 && (!tipo || !ubicacion)) {
      setError("Complete los datos obligatorios.");
      return;
    }
    if (activeStep === 1 && !polygon) {
      setError("Debe dibujar el polígono.");
      return;
    }
    if (activeStep === 2 && docs.length === 0) {
      setError("Debe cargar al menos un documento.");
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      <Typography variant="h5" sx={{ color: "#1b5e20", fontWeight: "bold" }}>
        📝 Solicitud de Permiso Forestal
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 3 }}>
        {steps.map((label, i) => (
          <Step key={i}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {activeStep === 0 && (
        <Card sx={{ p: 3 }}>
          <TextField
            select
            fullWidth
            label="Tipo de Permiso"
            sx={{ mb: 2 }}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <MenuItem value="PLAN_MANEJO">Plan de Manejo</MenuItem>
            <MenuItem value="SALVAMENTO">Permiso de Salvamento</MenuItem>
            <MenuItem value="SANEAMIENTO">Permiso de Saneamiento</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Ubicación del predio"
            sx={{ mb: 2 }}
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Card>
      )}

      {activeStep === 1 && (
        <Card sx={{ p: 2 }}>
          <Typography sx={{ mb: 2 }}>
            Dibuje el polígono del área donde desea solicitar el permiso:
          </Typography>
          <DrawMap onPolygonCreated={setPolygon} />
        </Card>
      )}

      {activeStep === 2 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6">📄 Subir Documentos Obligatorios</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Adjunte archivo PDF o imágenes según el tipo de permiso.
          </Typography>

          <input type="file" multiple onChange={handleDocs} />

          {docs.length > 0 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Documentos cargados: {docs.join(", ")}
            </Alert>
          )}
        </Card>
      )}

      {activeStep === 3 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6">🔍 Revisión Final</Typography>
          <Typography>Tipo: {tipo}</Typography>
          <Typography>Ubicación: {ubicacion}</Typography>
          <Typography>Documentos: {docs.join(", ")}</Typography>
          <Typography sx={{ mt: 2, color: "green" }}>
            Todo está listo para enviar a revisión del ICF.
          </Typography>
        </Card>
      )}

      {/* Botones de navegación */}
      <Box sx={{ mt: 3 }}>
        {activeStep > 0 && activeStep < steps.length && (
          <Button onClick={handleBack} sx={{ mr: 2 }}>
            Atrás
          </Button>
        )}

        {activeStep < steps.length - 1 && (
          <Button variant="contained" color="success" onClick={handleNext}>
            Siguiente
          </Button>
        )}

        {activeStep === steps.length - 1 && (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Enviar Solicitud
          </Button>
        )}
      </Box>
    </Box>
  );
}
