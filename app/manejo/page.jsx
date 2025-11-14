"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ManejoPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("solicitudes");
    if (stored) {
      const data = JSON.parse(stored);

      // 👇 Solo las que salieron bien del dictamen geográfico
      const filtradas = data.filter(
        (s) => s.estado === "EN_MANEJO"
      );

      setSolicitudes(filtradas);
    }
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "#1b5e20", mb: 2 }}
      >
        🌲 Módulo de Manejo – Planes de Manejo Pendientes
      </Typography>

      {solicitudes.length === 0 && (
        <Typography>No hay solicitudes pendientes de plan de manejo.</Typography>
      )}

      {solicitudes.map((s, i) => (
        <Card
          key={i}
          sx={{
            mb: 2,
            borderLeft: "6px solid #1b5e20",
            backgroundColor: "#f1f8e9"
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              Solicitud {s.id}
            </Typography>
            <Typography>
              <b>Ciudadano:</b> {s.ciudadano}
            </Typography>
            <Typography>
              <b>Fecha:</b> {s.fecha}
            </Typography>
            <Typography>
              <b>Estado actual:</b> {s.estado}
            </Typography>

            <Button
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
              onClick={() => router.push(`/manejo/${s.id}`)}
            >
              Abrir Plan de Manejo
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
