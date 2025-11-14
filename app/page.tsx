'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, TextField } from '@mui/material';

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Usuarios institucionales en duro
  const institutionalUsers = [
    { email: "icf.tecnico@icf.gob.hn", password: "123456", role: "ICF_TECNICO", name: "Técnico ICF" },
    { email: "icf.supervisor@icf.gob.hn", password: "123456", role: "ICF_SUPERVISOR", name: "Supervisor ICF" },
    { email: "fema@mp.hn", password: "123456", role: "FEMA", name: "Fiscal Ambiental" },
    { email: "serna@gob.hn", password: "123456", role: "SERNA", name: "SERNA / Gobierno Digital" },
    { email: "admin@icf.hn", password: "admin123", role: "ADMIN", name: "Administrador del Sistema" },
     {
        name: "Juan Pérez",
        email: "ciudadano@demo.hn",
        password: "12345",
        role: "CIUDADANO"
      },
       {
    name: "Técnico Geográfico ICF",
    email: "icf.geo@icf.gob.hn",
    role: "ICF_TECNICO_GEO" ,password: "123456",  // 👈 debe coincidir con el menú
  },
  {
  name: "Técnico de Manejo ICF",
  email: "manejo@icf.gob.hn",
  role: "ICF_MANEJO",password: "123456",  // 👈 debe coincidir con el menú
}
  ];

  // Si ya está logeado → enviarlo a /inicio
  useEffect(() => {
    const user = localStorage.getItem('bosqueUser');
    if (user) router.push('/inicio');
  }, []);

  const handleLogin = () => {

    if (!email || !password) {
      setError("Ingrese sus credenciales.");
      return;
    }

    // 1️⃣ Validar institucionales
    const foundInstitutional = institutionalUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundInstitutional) {
      localStorage.setItem("bosqueUser", JSON.stringify(foundInstitutional));
      router.push("/inicio");
      return;
    }

    // 2️⃣ Validar ciudadano (registrado previamente)
    const stored = localStorage.getItem("bosqueUserRegistered");

    if (stored) {
      const citizen = JSON.parse(stored);

      if (citizen.email === email && citizen.password === password) {
        localStorage.setItem(
          "bosqueUser",
          JSON.stringify({
            name: citizen.name,
            email: citizen.email,
            role: "CIUDADANO",
          })
        );

        router.push("/inicio");
        return;
      }
    }

    // 3️⃣ Si ninguna coincidió
    setError("Credenciales inválidas o usuario no registrado.");
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #63BBD3, #63BBD3)',
      }}
    >
      <Paper elevation={6} sx={{ p: 6, width: 420, textAlign: 'center', borderRadius: 4 }}>
        
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#63BBD3' }}>
          🌿 Bosque Vivo HN
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Plataforma de Permisos y Supervisión Forestal
        </Typography>

        <TextField
          fullWidth
          label="Correo electrónico"
          variant="outlined"
          sx={{ mt: 3 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          variant="outlined"
          sx={{ mt: 2 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography sx={{ mt: 2, color: 'red', fontWeight: 'bold' }}>
            {error}
          </Typography>
        )}

        <Button fullWidth variant="contained" color="success" sx={{ mt: 3 }} onClick={handleLogin}>
          Ingresar
        </Button>

        <Button
          fullWidth
          variant="text"
          sx={{ mt: 2, textDecoration: 'underline', fontWeight: 'bold' }}
          onClick={() => router.push('/registro')}
        >
          Crear cuenta nueva (Ciudadano)
        </Button>

      </Paper>
    </Box>
  );
}
