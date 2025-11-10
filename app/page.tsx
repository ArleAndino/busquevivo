'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Box, Button, Typography, Select, MenuItem, Paper, InputLabel, FormControl } from '@mui/material';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!role) {
      setError('Por favor selecciona un rol para continuar.');
      return;
    }
    // Simulamos guardar el rol en sessionStorage
    sessionStorage.setItem('userRole', role);
    router.push('/dashboard');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #1b5e20, #4caf50)',
      }}
    >
      <Paper elevation={6} sx={{ p: 6, width: 400, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
          🌿 Bosque Vivo HN
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Sistema de Monitoreo y Denuncia Ambiental
        </Typography>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="role-label">Selecciona tu rol</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            label="Selecciona tu rol"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="ICF_TECNICO">ICF Técnico</MenuItem>
            <MenuItem value="ICF_SUPERVISOR">ICF Supervisor</MenuItem>
            <MenuItem value="FEMA">Fiscalía Ambiental (FEMA)</MenuItem>
            <MenuItem value="SERNA">SERNA / Gobierno Digital</MenuItem>
          </Select>
        </FormControl>

        {error && <Typography sx={{ mt: 2, color: 'red' }}>{error}</Typography>}

        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
          onClick={handleLogin}
        >
          Ingresar
        </Button>
      </Paper>
    </Box>
  );
}
