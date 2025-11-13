'use client';
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Typography,
  CircularProgress,
} from '@mui/material';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: 'Juan Pérez',
    identidad: '0801199912345',
    telefono: '99998888',
    direccion: 'Barrio El Centro, Comayagua',
    correo: 'juan.perez@example.com',
  });

  const [loadingIA, setLoadingIA] = useState(false);
  const [validated, setValidated] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleValidateIA = () => {
    setLoadingIA(true);
    setTimeout(() => {
      setLoadingIA(false);
      setValidated(true);
      setSnackbar({
        open: true,
        message: '✅ Validación facial exitosa (93% de coincidencia).',
        severity: 'success',
      });
    }, 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validated) {
      setSnackbar({
        open: true,
        message: '⚠️ Debe realizar la validación facial antes de crear la cuenta.',
        severity: 'warning',
      });
      return;
    }

    // Simular guardado local
    localStorage.setItem('usuarioRegistro', JSON.stringify(formData));

    setSnackbar({
      open: true,
      message: '🎉 Usuario creado exitosamente. Se ha enviado un correo de activación.',
      severity: 'success',
    });

    // Reset
    setValidated(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Nombre Completo"
            name="nombre"
            fullWidth
            required
            value={formData.nombre}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Número de Identidad"
            name="identidad"
            fullWidth
            required
            value={formData.identidad}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Teléfono"
            name="telefono"
            fullWidth
            required
            value={formData.telefono}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Dirección"
            name="direccion"
            fullWidth
            required
            value={formData.direccion}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Correo Electrónico"
            name="correo"
            type="email"
            fullWidth
            required
            value={formData.correo}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
            Cargar documentos de identidad (simulado):
          </Typography>
          <Button variant="outlined" component="label" color="success">
            Subir Anverso
            <input hidden type="file" accept="image/*" />
          </Button>
          <Button variant="outlined" sx={{ ml: 2 }} component="label" color="success">
            Subir Reverso
            <input hidden type="file" accept="image/*" />
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={loadingIA}
            onClick={handleValidateIA}
            sx={{ bgcolor: '#1b5e20', '&:hover': { bgcolor: '#2e7d32' } }}
          >
            {loadingIA ? <CircularProgress size={24} color="inherit" /> : 'Verificar con IA'}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              bgcolor: validated ? '#1b5e20' : 'grey',
              '&:hover': { bgcolor: validated ? '#2e7d32' : 'grey' },
            }}
          >
            Crear Usuario
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </form>
  );
}
