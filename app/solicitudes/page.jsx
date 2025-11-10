'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Button,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetch('/mockdata/solicitudes.json')
      .then((res) => res.json())
      .then((data) => setSolicitudes(data))
      .catch((err) => console.error('Error cargando solicitudes:', err));
  }, []);

  const getColorByEstado = (estado) => {
    switch (estado) {
      case 'EN PROCESO':
        return 'warning';
      case 'VALIDADA':
        return 'success';
      case 'RECHAZADA':
        return 'error';
      default:
        return 'default';
    }
  };

  const solicitudesFiltradas = solicitudes.filter(
    (s) =>
      s.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.alertaId.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.area.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20', mb: 2 }}>
        🗂️ Solicitudes Ambientales
      </Typography>

      <Card sx={{ mb: 3, p: 2, bgcolor: '#f1f8e9' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            label="Buscar por ID, alerta o área"
            variant="outlined"
            size="small"
            fullWidth
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Button
            variant="contained"
            color="success"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Actualizar
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => alert('📤 Exportación simulada')}
          >
            Exportar
          </Button>
        </Box>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#e8f5e9' }}>
            <TableRow>
              <TableCell><b>ID Solicitud</b></TableCell>
              <TableCell><b>Fecha</b></TableCell>
              <TableCell><b>Alerta Asociada</b></TableCell>
              <TableCell><b>Área</b></TableCell>
              <TableCell><b>Hectáreas</b></TableCell>
              <TableCell><b>Confianza</b></TableCell>
              <TableCell><b>Estado</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitudesFiltradas.map((s, i) => (
              <TableRow key={i}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.fecha}</TableCell>
                <TableCell>{s.alertaId}</TableCell>
                <TableCell>{s.area}</TableCell>
                <TableCell>{s.hectareas}</TableCell>
                <TableCell>{(s.confianza * 100).toFixed(0)}%</TableCell>
                <TableCell>
                  <Chip label={s.estado} color={getColorByEstado(s.estado)} size="small" />
                </TableCell>
              </TableRow>
            ))}
            {solicitudesFiltradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    No hay solicitudes registradas
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
