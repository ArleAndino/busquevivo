'use client';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import AlertsTrend from './components/Charts/AlertsTrend';
import PrecisionChart from './components/Charts/PrecisionChart';

export default function Dashboard() {
  const stats = [
    { label: 'Alertas Generadas', value: 3 },
    { label: 'Solicitudes Activas', value: 2 },
    { label: 'Denuncias en Investigación', value: 1 },
    { label: 'Casos Cerrados', value: 0 },
    { label: 'Precisión del Modelo', value: '88%' }
  ];

  return (
    <Grid container spacing={2} p={3}>
      {stats.map((s, i) => (
        <Grid item xs={12} md={2.4} key={i}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="subtitle2">{s.label}</Typography>
              <Typography variant="h5" fontWeight="bold">{s.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12} md={6}><AlertsTrend /></Grid>
      <Grid item xs={12} md={6}><PrecisionChart /></Grid>
    </Grid>
  );
}
