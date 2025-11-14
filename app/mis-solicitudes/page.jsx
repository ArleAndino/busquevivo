'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, Button } from '@mui/material';
import { jsPDF } from "jspdf";

export default function MisSolicitudes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('solicitudes') || '[]');
    const user = JSON.parse(localStorage.getItem('bosqueUser')).email;

    const propias = all.filter(s => s.ciudadano === user);
    setData(propias);
  }, []);

  // 🔥 GENERAR PDF DINÁMICO DEL PLAN DE MANEJO
  const descargarPlanManejold = (sol) => {
    if (!sol.planManejo) {
      alert("Esta solicitud no tiene un plan de manejo aprobado.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("INSTITUTO DE CONSERVACIÓN FORESTAL (ICF)", 10, 15);
    doc.text("DICTAMEN DE PLAN DE MANEJO FORESTAL", 10, 25);

    doc.setFontSize(12);
    doc.text(`Solicitud: ${sol.id}`, 10, 40);
    doc.text(`Ciudadano: ${sol.ciudadano}`, 10, 48);
    doc.text(`Fecha aprobación: ${sol.planManejo.fechaAprobacion}`, 10, 56);
    doc.text(`Modalidad: ${sol.planManejo.modalidad}`, 10, 64);
    doc.text(`Vigencia (años): ${sol.planManejo.vigenciaAnios}`, 10, 72);
    doc.text(`Monitoreo: ${sol.planManejo.frecuenciaMonitoreo}`, 10, 80);
    doc.text(`Volumen máximo anual: ${sol.planManejo.volumenMaxAnual}`, 10, 88);
    doc.text(`Área autorizada (ha): ${sol.planManejo.areaAutorizada}`, 10, 96);

    doc.text("Observaciones:", 10, 110);
    doc.text(sol.planManejo.observaciones || "—", 10, 118);

    doc.setFontSize(10);
    doc.text(
      "Este documento es una simulación generada automáticamente para efectos demostrativos.",
      10,
      150
    );

    // Nombre del archivo
    const filename =
      sol.planManejo.nombreDocumento || `PLAN_MANEJO_${sol.id}.pdf`;

    doc.save(filename);
  };

    // 🔥 GENERAR PDF DINÁMICO DEL PLAN DE MANEJO
  const descargarPlanManejo = async (sol) => {
    if (!sol.planManejo) {
      alert("Esta solicitud no tiene un plan de manejo aprobado.");
      return;
    }

    const doc = new jsPDF();

    // === 1. CARGAR LOGO DEL ICF ===
    // Puedes usar cualquier imagen PNG/JPG
    const logoUrl = "/icf.png"; // Debes colocar el archivo en /public

    const logoImg = await fetch(logoUrl)
      .then((res) => res.blob())
      .then((blob) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      });

    // Insertar logo en el PDF (x, y, ancho, alto)
    doc.addImage(logoImg, "PNG", 10, 10, 30, 30);

    // === ENCABEZADO ===
    doc.setFontSize(16);
    doc.text("INSTITUTO DE CONSERVACIÓN FORESTAL (ICF)", 50, 20);
    doc.text("DICTAMEN DE PLAN DE MANEJO FORESTAL", 50, 30);

    // === CUERPO ===
    doc.setFontSize(12);
    doc.text(`Solicitud: ${sol.id}`, 10, 50);
    doc.text(`Ciudadano: ${sol.ciudadano}`, 10, 58);
    doc.text(`Fecha aprobación: ${sol.planManejo.fechaAprobacion}`, 10, 66);
    doc.text(`Modalidad: ${sol.planManejo.modalidad}`, 10, 74);
    doc.text(`Vigencia (años): ${sol.planManejo.vigenciaAnios}`, 10, 82);
    doc.text(`Monitoreo: ${sol.planManejo.frecuenciaMonitoreo}`, 10, 90);
    doc.text(`Volumen máximo anual: ${sol.planManejo.volumenMaxAnual}`, 10, 98);
    doc.text(`Área autorizada (ha): ${sol.planManejo.areaAutorizada}`, 10, 106);

    doc.text("Observaciones:", 10, 120);

    // Texto multilínea
    const observ = sol.planManejo.observaciones || "—";
    doc.text(doc.splitTextToSize(observ, 180), 10, 128);

    // PIE DE PÁGINA
    doc.setFontSize(10);
    doc.text(
      "Documento generado automáticamente por el Sistema Bosque Vivo HN – Módulo de Dictamen Forestal.",
      10,
      280
    );

    // === NOMBRE DEL ARCHIVO ===
    const filename =
      sol.planManejo.nombreDocumento || `PLAN_MANEJO_${sol.id}.pdf`;

    doc.save(filename);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1b5e20' }}>
        📄 Mis Solicitudes
      </Typography>

      {data.map((sol) => (
        <Card key={sol.id} sx={{ mt: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {sol.id} – {sol.tipo}
            </Typography>

            <Typography><b>Ubicación:</b> {sol.ubicacion}</Typography>
            <Typography><b>Fecha:</b> {sol.fecha}</Typography>

            <Chip
              label={sol.estado}
              sx={{ mt: 1, fontWeight: "bold" }}
              color="primary"
            />

            {/* Si existe un Plan de Manejo aprobado */}
            {sol.planManejo && (
              <Card sx={{ mt: 3, p: 2, backgroundColor: "#e3f2fd" }}>
                <Typography variant="h6">📘 Plan de Manejo Aprobado</Typography>

                <Typography sx={{ mt: 1 }}>
                  <b>Documento:</b> {sol.planManejo.nombreDocumento}
                </Typography>

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => descargarPlanManejo(sol)}
                >
                  Descargar PDF del Dictamen
                </Button>
              </Card>
            )}

            {/* 📌 HISTORIAL */}
            <Card sx={{ mt: 4, p: 2, backgroundColor: "#f9fbe7" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                📌 Historial de la Solicitud
              </Typography>

              {(!sol.track || sol.track.length === 0) && (
                <Typography color="text.secondary">
                  No hay movimientos registrados aún.
                </Typography>
              )}

              {sol.track && sol.track.map((t, i) => (
                <Card
                  key={i}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: "#e8f5e9",
                    borderLeft: "5px solid #4caf50"
                  }}
                >
                  <Typography>
                    <b>Fecha:</b> {new Date(t.fecha).toLocaleString()}
                  </Typography>
                  <Typography>
                    <b>Estado:</b> {t.estado}
                  </Typography>
                  <Typography>
                    <b>Usuario:</b> {t.usuario}
                  </Typography>
                  <Typography>
                    <b>Observación:</b> {t.observacion || "—"}
                  </Typography>
                </Card>
              ))}
            </Card>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
