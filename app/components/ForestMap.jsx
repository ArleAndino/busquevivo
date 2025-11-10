'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

// Ícono personalizado
const alertIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -20],
});

// Carga dinámica del mapa (evita error window)
const ForestMap = dynamic(
  async () => {
    const { MapContainer, TileLayer, Marker, Popup, Polygon } = await import('react-leaflet');

    return function ForestMapInner() {
      const [alerts, setAlerts] = useState([]);
      const [solicitudes, setSolicitudes] = useState([]);

      // Cargar alertas iniciales
      useEffect(() => {
        fetch('/mockdata/alerts.geojson')
          .then((res) => res.json())
          .then((data) => setAlerts(data.features))
          .catch((err) => console.error('Error cargando alertas:', err));
      }, []);

      // Color por estado
      const getColorByStatus = (status) => {
        switch (status) {
          case 'CONFIRMADA': return '#4caf50';
          case 'DENUNCIADA': return '#f44336';
          case 'GENERADA': return '#ffeb3b';
          case 'EN_SOLICITUD': return '#90caf9';
          default: return '#2196f3';
        }
      };

      // Acción al crear solicitud
      const handleCreateSolicitud = (id) => {
        const alerta = alerts.find((a) => a.properties.id === id);
        if (!alerta) return;

        // Crear nueva solicitud simulada
        const nuevaSolicitud = {
          id: `SOL-${(solicitudes.length + 1).toString().padStart(3, '0')}`,
          fecha: new Date().toISOString().split('T')[0],
          alertaId: id,
          area: alerta.properties.area,
          hectareas: alerta.properties.hectares,
          confianza: alerta.properties.confidence,
          estado: 'EN PROCESO'
        };

        // Actualizar estados en memoria
        setSolicitudes([...solicitudes, nuevaSolicitud]);
        setAlerts(alerts.filter((a) => a.properties.id !== id)); // eliminar del monitoreo

        alert(`✅ Solicitud ${nuevaSolicitud.id} creada para ${id}`);
      };

      return (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '80vh' }}>
          {/* 🌍 Mapa de monitoreo */}
          <Box sx={{ flex: 7, borderRadius: '10px', overflow: 'hidden' }}>
            <MapContainer
              center={[14.8, -86.5]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {alerts.map((a, i) => {
                const { geometry, properties } = a;

                if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
                  const positions = geometry.coordinates.map((ring) =>
                    ring.map(([lon, lat]) => [lat, lon])
                  );

                  return (
                    <Polygon
                      key={`poly-${i}`}
                      positions={positions}
                      pathOptions={{
                        color: getColorByStatus(properties.status),
                        fillOpacity: 0.4,
                      }}
                    >
                      <Popup>
                        <b>{properties.id}</b><br />
                        Zona: {properties.area}<br />
                        Hectáreas: {properties.hectares}<br />
                        Confianza: {(properties.confidence * 100).toFixed(0)}%<br />
                        Estado: {properties.status}<br />
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => handleCreateSolicitud(properties.id)}
                        >
                          Crear Solicitud
                        </Button>
                      </Popup>
                    </Polygon>
                  );
                }

                if (geometry.type === 'Point') {
                  return (
                    <Marker
                      key={`marker-${i}`}
                      position={[geometry.coordinates[1], geometry.coordinates[0]]}
                      icon={alertIcon}
                    >
                      <Popup>
                        <b>{properties.id}</b><br />
                        Zona: {properties.area}<br />
                        Hectáreas: {properties.hectares}<br />
                        Confianza: {(properties.confidence * 100).toFixed(0)}%<br />
                        Estado: {properties.status}<br />
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => handleCreateSolicitud(properties.id)}
                        >
                          Crear Solicitud
                        </Button>
                      </Popup>
                    </Marker>
                  );
                }

                return null;
              })}
            </MapContainer>
          </Box>

          {/* 📋 Panel lateral de alertas activas */}
          <Box sx={{ flex: 3, overflowY: 'auto', height: '80vh', pr: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1b5e20' }}>
              Alertas Activas ({alerts.length})
            </Typography>

            {alerts.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No hay alertas activas en monitoreo.
              </Typography>
            )}

            {alerts.map((a, i) => (
              <Card
                key={i}
                sx={{
                  mb: 2,
                  borderLeft: `6px solid ${getColorByStatus(a.properties.status)}`,
                  backgroundColor: '#f9fbe7',
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {a.properties.id} — {a.properties.area}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <b>Fecha:</b> {a.properties.date}
                  </Typography>
                  <Typography variant="body2">
                    <b>Hectáreas:</b> {a.properties.hectares}<br />
                    <b>Confianza:</b> {(a.properties.confidence * 100).toFixed(0)}%<br />
                    <b>Estado:</b> {a.properties.status}
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => handleCreateSolicitud(a.properties.id)}
                  >
                    Crear Solicitud
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* 🔹 Panel inferior con solicitudes creadas */}
            {solicitudes.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 3, mb: 2, color: '#0d47a1' }}>
                  Solicitudes Generadas ({solicitudes.length})
                </Typography>

                {solicitudes.map((s, i) => (
                  <Card
                    key={i}
                    sx={{
                      mb: 2,
                      borderLeft: '6px solid #90caf9',
                      backgroundColor: '#e3f2fd',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {s.id}
                      </Typography>
                      <Typography variant="body2">
                        <b>Desde alerta:</b> {s.alertaId}<br />
                        <b>Área:</b> {s.area}<br />
                        <b>Hectáreas:</b> {s.hectareas}<br />
                        <b>Confianza:</b> {(s.confianza * 100).toFixed(0)}%<br />
                        <b>Estado:</b> {s.estado}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </Box>
        </Box>
      );
    };
  },
  { ssr: false }
);

export default ForestMap;
