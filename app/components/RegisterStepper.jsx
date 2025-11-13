'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Stepper, Step, StepLabel, Button, Grid, TextField,
  Typography, Snackbar, Alert, CircularProgress, Box
} from '@mui/material';
import { sendEmailMock } from './utils/senEmailMock';
import { usePathname, useRouter } from 'next/navigation';
const steps = ['Datos Personales', 'Documentos de Identidad', 'Validación Facial'];

export default function RegisterStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '', identidad: '', telefono: '', direccion: '', correo: '',
    anverso: null, reverso: null, video: null
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const router = useRouter();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [e.target.name]: file });
  };

  const handleNext = () => {
    if (activeStep === 2) handleSend();
    else setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSendold = async () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      sendEmailMock(formData.correo);
      setSnackbar({
        open: true,
        message: `✅ Validación facial exitosa (92.8% coincidencia). Correo enviado a ${formData.correo}.`,
        severity: 'success',
      });
      setActiveStep(0);
    }, 3000);
  };


const handleSendold2= async () => {
  setLoading(true);
  setTimeout(() => {
    // Generar contraseña aleatoria
    const password = Math.random().toString(36).slice(-8);
    const nuevoUsuario = { ...formData, password };

    // Obtener usuarios previos
    const usuariosPrevios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    const usuariosActualizados = [...usuariosPrevios, nuevoUsuario];

    // Guardar
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosActualizados));

    // Envío de correo simulado
    sendEmailMock(formData.correo, password);

    setLoading(false);
    setSnackbar({
      open: true,
      message: `✅ Validación facial exitosa (92.8% coincidencia). Usuario creado y correo enviado a ${formData.correo}.`,
      severity: 'success',
    });
    setActiveStep(0);

    // Limpieza
    setFormData({
      nombre: '', identidad: '', telefono: '', direccion: '', correo: '',
      anverso: null, reverso: null, video: null,
    });
  }, 3000);
};

const handleSend = async () => {
  setLoading(true);
  setTimeout(async () => {
    const password = Math.random().toString(36).slice(-8);
    const nuevoUsuario = { ...formData, password };

    const usuariosPrevios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    const usuariosActualizados = [...usuariosPrevios, nuevoUsuario];
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosActualizados));

    try {
      // 🔹 Envío de correo real al backend
      const res = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.correo, password }),
      });

      if (!res.ok) throw new Error('Error al enviar el correo');

      setSnackbar({
        open: true,
        message: `✅ Validación facial exitosa (92.8%). Correo enviado a ${formData.correo}.`,
        severity: 'success',
      });

      router.push('/inicio');

    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: '❌ No se pudo enviar el correo, revise su configuración.',
        severity: 'error',
      });
    }

    setLoading(false);
    setActiveStep(0);
  }, 3000);
};


  // --- Captura facial simulada ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStream(stream);
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setFormData({ ...formData, video: 'video-simulado.mp4' });
        setSnackbar({
          open: true,
          message: '🎥 Video capturado (5 segundos). Procesando con IA...',
          severity: 'info',
        });
      }, 5000);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al activar cámara', severity: 'error' });
    }
  };

  // --- Renderizado de pasos ---
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField label="Nombre Completo" name="nombre" fullWidth required value={formData.nombre} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField label="Número de Identidad" name="identidad" fullWidth required value={formData.identidad} onChange={handleChange} /></Grid>
            <Grid item xs={6}><TextField label="Teléfono" name="telefono" fullWidth required value={formData.telefono} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField label="Dirección" name="direccion" fullWidth required value={formData.direccion} onChange={handleChange} /></Grid>
            <Grid item xs={12}><TextField label="Correo Electrónico" name="correo" type="email" fullWidth required value={formData.correo} onChange={handleChange} /></Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>Suba las imágenes de su documento de identidad:</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button variant="outlined" component="label" color="success" fullWidth>
                  Subir Anverso
                  <input hidden type="file" accept="image/*" name="anverso" onChange={handleFileUpload} />
                </Button>
                {formData.anverso && (
                  <img src={URL.createObjectURL(formData.anverso)} alt="Anverso" style={{ width: '100%', marginTop: 10, borderRadius: 8 }} />
                )}
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" component="label" color="success" fullWidth>
                  Subir Reverso
                  <input hidden type="file" accept="image/*" name="reverso" onChange={handleFileUpload} />
                </Button>
                {formData.reverso && (
                  <img src={URL.createObjectURL(formData.reverso)} alt="Reverso" style={{ width: '100%', marginTop: 10, borderRadius: 8 }} />
                )}
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box textAlign="center">
            <Typography variant="body2" sx={{ mb: 2 }}>
              Active su cámara para la verificación facial (grabación de 5 segundos).
            </Typography>
            <video ref={videoRef} autoPlay muted style={{ width: '100%', borderRadius: 8, border: '1px solid #ccc' }} />
            <Button variant="contained" sx={{ mt: 2, bgcolor: '#1b5e20' }} onClick={startRecording}>
              Activar Cámara y Grabar
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {renderStep()}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>Atrás</Button>
        <Button variant="contained" color="primary" onClick={handleNext} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : activeStep === 2 ? 'Enviar Solicitud' : 'Siguiente'}
        </Button>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
