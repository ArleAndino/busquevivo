'use client';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import RegisterStepper from '../components/RegisterStepper';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
      const router = useRouter();
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#1b5e20', fontWeight: 'bold' }}>
        🌳 Registro de Usuario - Bosque Vivo HN
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Complete los tres pasos del registro para crear su cuenta en el sistema. 
        El proceso incluye validación facial simulada y envío de confirmación por correo electrónico.
      </Typography>

      <Card sx={{ maxWidth: 800, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <RegisterStepper />
        </CardContent>
      </Card>
      {/* Botón para volver al login */}
      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="success"
          onClick={() => router.push('/')}
          sx={{ fontWeight: 'bold' }}
        >
          ⬅️ Regresar al Inicio / Login
        </Button>
      </Box>
    </Box>
  );
}
