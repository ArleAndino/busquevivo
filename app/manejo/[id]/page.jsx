"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button
} from "@mui/material";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";

export default function PlanManejoPage({ params }) {
  const router = useRouter();
  const resolved = React.use(params); // desenvuelve la Promise
  const id = resolved.id;

  const [solicitud, setSolicitud] = useState(null);

  // Campos del plan
  const [modalidad, setModalidad] = useState("");
  const [vigenciaAnios, setVigenciaAnios] = useState(5);
  const [frecuenciaMonitoreo, setFrecuenciaMonitoreo] = useState("ANUAL");
  const [volumenMaxAnual, setVolumenMaxAnual] = useState("");
  const [areaAutorizada, setAreaAutorizada] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const nombreDocumento = `PLAN_MANEJO_${id}.pdf`;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("solicitudes") || "[]");
    const found = stored.find((s) => String(s.id) === String(id));

    if (found) {
      setSolicitud(found);

      if (found.planManejo) {
        const pm = found.planManejo;
        setModalidad(pm.modalidad);
        setFrecuenciaMonitoreo(pm.frecuenciaMonitoreo);
        setVigenciaAnios(pm.vigenciaAnios);
        setVolumenMaxAnual(pm.volumenMaxAnual);
        setAreaAutorizada(pm.areaAutorizada);
        setObservaciones(pm.observaciones);
      }
    }
  }, [id]);

  if (!solicitud) {
    return <Typography>Cargando solicitud...</Typography>;
  }

  // 📌 Generar el PDF del plan de manejo y devolver base64
  function generarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("PLAN DE MANEJO FORESTAL", 20, 20);

    doc.setFontSize(12);
    doc.text(`Solicitud: ${solicitud.id}`, 20, 35);
    doc.text(`Ciudadano: ${solicitud.ciudadano}`, 20, 45);
    doc.text(`Modalidad: ${modalidad}`, 20, 60);
    doc.text(`Vigencia: ${vigenciaAnios} años`, 20, 70);
    doc.text(`Frecuencia de Monitoreo: ${frecuenciaMonitoreo}`, 20, 80);
    doc.text(`Volumen Máx.: ${volumenMaxAnual} m3`, 20, 90);
    doc.text(`Área Autorizada: ${areaAutorizada} ha`, 20, 100);
    doc.text(`Observaciones:`, 20, 120);
    doc.text(`${observaciones}`, 20, 130, { maxWidth: 170 });

    return doc.output("datauristring");
  }

  function guardarPlanManejo() {
    const pdfBase64 = generarPDF();

    const stored = JSON.parse(localStorage.getItem("solicitudes") || "[]");

    const updated = stored.map((s) => {
      if (String(s.id) !== String(id)) return s;

      const planManejo = {
        modalidad,
        vigenciaAnios,
        frecuenciaMonitoreo,
        volumenMaxAnual,
        areaAutorizada,
        observaciones,
        pdfBase64,
        fechaAprobacion: new Date().toISOString()
      };

      return {
        ...s,
        estado: "EN_EJECUCION",
        planManejo,
        documentos: [
          ...(s.documentos || []),
          nombreDocumento
        ],
        track: [
          ...(s.track || []),
          {
            fecha: new Date().toISOString(),
            estado: "EN_EJECUCION",
            observacion:
              "Plan de manejo aprobado. Permiso en ejecución y sujeto a monitoreo satelital.",
            usuario: "TÉCNICO DE MANEJO ICF"
          }
        ]
      };
    });

    localStorage.setItem("solicitudes", JSON.stringify(updated));
    alert("Plan de manejo aprobado y PDF guardado.");
    router.push("/manejo");
  }

  function descargarPDF() {
    if (!solicitud.planManejo?.pdfBase64) {
      alert("Aún no se ha generado el PDF.");
      return;
    }

    const link = document.createElement("a");
    link.href = solicitud.planManejo.pdfBase64;
    link.download = nombreDocumento;
    link.click();
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1b5e20" }}>
        🌲 Plan de Manejo – {solicitud.id}
      </Typography>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography><b>Ciudadano:</b> {solicitud.ciudadano}</Typography>
          <Typography><b>Estado actual:</b> {solicitud.estado}</Typography>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Datos del Plan de Manejo
        </Typography>

        <TextField select fullWidth label="Modalidad" value={modalidad}
          onChange={(e) => setModalidad(e.target.value)} sx={{ mb: 2 }}>
          <MenuItem value="TALA_SELECTIVA">Tala Selectiva</MenuItem>
          <MenuItem value="TALA_RASA_SEMILLEROS">Tala Rasa con Semilleros</MenuItem>
          <MenuItem value="APROVECHAMIENTO_MENOR">Aprovechamiento Menor</MenuItem>
        </TextField>

        <TextField type="number" fullWidth label="Vigencia (años)"
          value={vigenciaAnios} onChange={(e) => setVigenciaAnios(e.target.value)}
          sx={{ mb: 2 }} />

        <TextField select fullWidth label="Frecuencia de monitoreo"
          value={frecuenciaMonitoreo} onChange={(e) => setFrecuenciaMonitoreo(e.target.value)}
          sx={{ mb: 2 }}>
          <MenuItem value="MENSUAL">Mensual</MenuItem>
          <MenuItem value="TRIMESTRAL">Trimestral</MenuItem>
          <MenuItem value="ANUAL">Anual</MenuItem>
        </TextField>

        <TextField fullWidth label="Volumen máximo (m³)"
          value={volumenMaxAnual} onChange={(e) => setVolumenMaxAnual(e.target.value)}
          sx={{ mb: 2 }} />

        <TextField fullWidth label="Área autorizada (ha)"
          value={areaAutorizada} onChange={(e) => setAreaAutorizada(e.target.value)}
          sx={{ mb: 2 }} />

        <TextField multiline minRows={3} fullWidth label="Observaciones"
          value={observaciones} onChange={(e) => setObservaciones(e.target.value)}
          sx={{ mb: 2 }} />

        <Button variant="contained" color="success" onClick={guardarPlanManejo}>
          Guardar Plan de Manejo + Generar PDF
        </Button>

        {solicitud.planManejo?.pdfBase64 && (
          <Button variant="outlined" sx={{ mt: 2 }} onClick={descargarPDF}>
            Descargar PDF del Plan de Manejo
          </Button>
        )}
      </Card>
    </Box>
  );
}
