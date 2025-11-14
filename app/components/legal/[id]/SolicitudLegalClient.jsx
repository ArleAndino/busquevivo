'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SolicitudLegalClient({ id }) {
  const router = useRouter();
  const [solicitud, setSolicitud] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("solicitudes") || "[]");

    const sol = stored.find((s) => s.id === id);
    setSolicitud(sol);
  }, [id]);

  if (!solicitud) return <p>Cargando solicitud...</p>;

  return (
    <div>
      <h2>Solicitud Legal: {solicitud.id}</h2>
      <p>Área: {solicitud.area}</p>
      <p>Hectáreas: {solicitud.hectareas}</p>
    </div>
  );
}
