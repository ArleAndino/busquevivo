"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  TextField,
} from "@mui/material";

// Gráficas ya existentes
import AlertsTrend from "../components/Charts/AlertsTrend";
import PrecisionChart from "../components/Charts/PrecisionChart";

export default function Dashboard() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [filtroUbicacion, setFiltroUbicacion] = useState("TODOS");

  /** ----------------------------------------------------
   * 🟩 CARGA INICIAL: si no existen solicitudes en storage,
   * se insertan solicitudes ficticias para alimentar el dashboard
   * ---------------------------------------------------- */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("solicitudes") || "[]");

    if (stored.length === 0) {
      const demo = [
        {
          id: "SOL-DEM-01",
          ciudadano: "demo1@mail.com",
          tipo: "PLAN_MANEJO",
          fecha: "2025-01-15",
          ubicacion: "Olancho",
          estado: "ENVIADA",
          track: [],
        },
        {
          id: "SOL-DEM-02",
          ciudadano: "demo2@mail.com",
          tipo: "SALVAMENTO",
          fecha: "2025-01-18",
          ubicacion: "Colón",
          estado: "PREDICTAMEN GEOGRAFICO",
          track: [],
        },
        {
          id: "SOL-DEM-03",
          ciudadano: "demo3@mail.com",
          tipo: "PLAN_MANEJO",
          fecha: "2025-01-12",
          ubicacion: "Yoro",
          estado: "EN_EJECUCION",
          track: [],
        },
        {
          id: "SOL-DEM-04",
          ciudadano: "demo4@mail.com",
          tipo: "PLAN_MANEJO",
          fecha: "2024-12-10",
          ubicacion: "Olancho",
          estado: "FINALIZADA",
          track: [],
        },
      ];

      localStorage.setItem("solicitudes", JSON.stringify(demo));
      setSolicitudes(demo);
      setUbicaciones(["TODOS", ...new Set(demo.map((s) => s.ubicacion))]);
      return;
    }

    // Si ya existen
    setSolicitudes(stored);
    setUbicaciones(["TODOS", ...new Set(stored.map((s) => s.ubicacion))]);
  }, []);

  /** ----------------------------------------------------
   * 🟦 FILTRO POR UBICACIÓN
   * ---------------------------------------------------- */
  const dataFiltrada =
    filtroUbicacion === "TODOS"
      ? solicitudes
      : solicitudes.filter((s) => s.ubicacion === filtroUbicacion);

  /** ----------------------------------------------------
   * 🟨 CÁLCULO DE INDICADORES
   * ---------------------------------------------------- */
  const total = dataFiltrada.length;

  const pendientes = dataFiltrada.filter((s) =>
    ["ENVIADA", "INCOMPLETA"].includes(s.estado)
  ).length;

  const enDictamen = dataFiltrada.filter((s) =>
    ["PREDICTAMEN GEOGRAFICO"].includes(s.estado)
  ).length;

  const aprobadas = dataFiltrada.filter((s) =>
    ["APROBADA", "EN_EJECUCION"].includes(s.estado)
  ).length;

  const finalizadas = dataFiltrada.filter((s) =>
    ["FINALIZADA"].includes(s.estado)
  ).length;

  const rechazadas = dataFiltrada.filter((s) =>
    ["RECHAZADA"].includes(s.estado)
  ).length;

  const cumplimiento =
    total > 0 ? ((finalizadas / total) * 100).toFixed(1) + "%" : "0%";

  const cards = [
    { label: "Solicitudes Pendientes", value: pendientes, color: "#ffebee" },
    { label: "En Dictamen Geográfico", value: enDictamen, color: "#fff3e0" },
    { label: "Aprobadas / En Ejecución", value: aprobadas, color: "#e8f5e9" },
    { label: "Finalizadas", value: finalizadas, color: "#e3f2fd" },
    { label: "Rechazadas", value: rechazadas, color: "#fbe9e7" },
    { label: "Cumplimiento Global", value: cumplimiento, color: "#f1f8e9" },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1b5e20", mb: 3 }}>
        📊 Dashboard General del Sistema Forestal – ICF
      </Typography>

      {/* FILTRO DE UBICACIÓN */}
      <Box sx={{ maxWidth: 300, mb: 3 }}>
        <TextField
          fullWidth
          select
          label="Filtrar por ubicación"
          value={filtroUbicacion}
          onChange={(e) => setFiltroUbicacion(e.target.value)}
        >
          {ubicaciones.map((u) => (
            <MenuItem key={u} value={u}>
              {u}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Cards de indicadores */}
      <Grid container spacing={2}>
        {cards.map((item, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
            <Card sx={{ bgcolor: item.color }}>
              <CardContent>
                <Typography variant="subtitle2">{item.label}</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráficas */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <AlertsTrend />
        </Grid>
        <Grid item xs={12} md={6}>
          <PrecisionChart />
        </Grid>
      </Grid>
    </Box>
  );
}
