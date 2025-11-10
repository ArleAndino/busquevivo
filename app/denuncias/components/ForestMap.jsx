'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

export default function ForestMap() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch('/mockdata/alerts.geojson')
      .then(r => r.json())
      .then(d => setAlerts(d.features));
  }, []);

  return (
    <MapContainer center={[15.3, -86.5]} zoom={6} style={{ height: '80vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {alerts.map((a, i) => (
        <Marker key={i} position={[a.geometry.coordinates[1], a.geometry.coordinates[0]]}>
          <Popup>
            <b>{a.properties.id}</b><br/>
            Zona: {a.properties.area}<br/>
            Confianza: {Math.round(a.properties.confidence * 100)}%<br/>
            Estado: {a.properties.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
