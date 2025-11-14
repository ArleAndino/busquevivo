'use client';

import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MiniMap({ geojson }) {
  const coords = geojson.geometry.coordinates[0].map(
    ([lon, lat]) => [lat, lon]
  );

  return (
    <MapContainer
      center={coords[0]}
      zoom={14}
      style={{ height: '40vh', width: '100%', borderRadius: '10px', marginTop: '10px' }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polygon positions={coords} pathOptions={{ color: 'green' }} />
    </MapContainer>
  );
}
