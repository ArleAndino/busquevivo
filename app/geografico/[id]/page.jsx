"use client";

import React from "react";
import { useEffect, useState } from "react";
import {
  Box, Typography, Button, Card, CardContent
} from "@mui/material";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { CAPAS } from "./capas";
import { generarDictamenPDF } from "./pdf-generator";

// Cargar mapa
const MiniMap = dynamic(() => import("./mini-map"), { ssr: false });

export default function DictamenGeoPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [solicitud, setSolicitud] = useState(null);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("solicitudes") || "[]");
    const found = stored.find((s) => s.id === id);
    setSolicitud(found);
  }, [id]);

  function validarIA() {
    const poly = solicitud.polygon.geometry.coordinates[0].map(([lon, lat]) => [lat, lon]);

    let conflicto = [];

    CAPAS.areasProtegidas.forEach((ap) => {
      if (Math.abs(ap.polygon[0][0] - poly[0][0]) < 0.2) {
        conflicto.push(ap.nombre);
      }
    });

    CAPAS.microcuencas.forEach((mc) => {
      if (Math.abs(mc.polygon[0][0] - poly[0][0]) < 0.2) {
        conflicto.push(mc.nombre);
      }
    });

    const estado = conflicto.length > 0 ? "NO PROCEDE" : "APROBADO";

    const res = { estado, detalles: conflicto };
    setResultado(res);
  }

  function generarDictamen() {
    const pdfBase64 = generarDictamenPDF(solicitud, resultado);

    const stored = JSON.parse(localStorage.getItem("solicitudes"));
    const updated = stored.map((s) => {
      if (s.id === solicitud.id) {
        return {
          ...s,
          estado: "EN_MANEJO",
          documentos: [
            ...s.documentos,
            `DICTAMEN_${s.id}.pdf`
          ],
          dictamenPDF: pdfBase64,
          track: [
            ...(s.track || []),
            {
              fecha: new Date().toISOString(),
              estado: "EN_MANEJO",
              observacion: "Dictamen geográfico generado",
              usuario: "TÉCNICO GEOGRÁFICO ICF"
            }
          ]
        };
      }
      return s;
    });

    localStorage.setItem("solicitudes", JSON.stringify(updated));
    alert("Dictamen generado");
    router.push("/geografico");
  }

  if (!solicitud) return <div>Cargando...</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1b5e20" }}>
        🌎 Dictamen Geográfico – {solicitud.id}
      </Typography>

      <Card sx={{ mt: 2, backgroundColor: "#e3f2fd" }}>
        <CardContent>
          <Typography><b>Tipo:</b> {solicitud.tipo}</Typography>
          <Typography><b>Ciudadano:</b> {solicitud.ciudadano}</Typography>
          <Typography><b>Estado Actual:</b> {solicitud.estado}</Typography>
        </CardContent>
      </Card>

      <MiniMap geojson={solicitud.polygon} capas={CAPAS} />

      {!resultado && (
        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={validarIA}>
          Validar Polígono con IA
        </Button>
      )}

      {resultado && (
        <>
          <Card sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6">Resultado IA</Typography>
            <Typography>Estado: <b>{resultado.estado}</b></Typography>

            {resultado.detalles.length > 0 && (
              <>
                <Typography sx={{ mt: 1 }}>Conflictos detectados:</Typography>
                {resultado.detalles.map((d, i) => (
                  <Typography key={i}>• {d}</Typography>
                ))}
              </>
            )}
          </Card>

          <Button variant="contained" color="success" sx={{ mt: 3 }} onClick={generarDictamen}>
            Generar Dictamen PDF
          </Button>
        </>
      )}
    </Box>
  );
}
