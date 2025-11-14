// app/geografico/pdf-generator.js

import jsPDF from "jspdf";

/**
 * Genera un dictamen geográfico en PDF basado en la solicitud y el resultado de la validación.
 * Devuelve un string en formato data URI (data:application/pdf;base64,....)
 */
export function generarDictamenPDF(solicitud, resultado) {
  const doc = new jsPDF();

  const fecha = new Date().toLocaleString("es-HN", {
    timeZone: "America/Tegucigalpa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Encabezado
  doc.setFontSize(14);
  doc.text("Instituto de Conservación Forestal (ICF)", 10, 15);
  doc.setFontSize(12);
  doc.text("Dictamen geográfico de solicitud de aprovechamiento forestal", 10, 23);

  // Datos generales
  let y = 35;
  doc.setFontSize(11);
  doc.text(`Fecha: ${fecha}`, 10, y); y += 7;
  doc.text(`ID de solicitud: ${solicitud?.id ?? "-"}`, 10, y); y += 7;
  doc.text(`Tipo de solicitud: ${solicitud?.tipo ?? "-"}`, 10, y); y += 7;
  doc.text(`Ciudadano / Propietario: ${solicitud?.ciudadano ?? "-"}`, 10, y); y += 10;

  // Resultado de la validación geográfica
  doc.setFontSize(12);
  doc.text("Resultado de la revisión geográfica", 10, y); y += 7;
  doc.setFontSize(11);
  doc.text(`Estado del dictamen: ${resultado?.estado ?? "-"}`, 10, y); y += 7;

  if (resultado?.detalles && resultado.detalles.length > 0) {
    doc.text("Conflictos detectados:", 10, y); 
    y += 7;
    resultado.detalles.forEach((d) => {
      doc.text(`• ${d}`, 12, y);
      y += 6;
    });
  } else {
    doc.text(
      "No se detectaron conflictos con áreas protegidas ni microcuencas registradas.",
      10,
      y
    );
    y += 10;
  }

  // Observaciones / nota institucional
  y += 5;
  doc.setFontSize(12);
  doc.text("Observaciones", 10, y); y += 7;
  doc.setFontSize(11);

  const obs = resultado?.estado === "APROBADO"
    ? "El polígono evaluado no presenta superposición con capas de restricción según la información disponible en el sistema geográfico institucional."
    : "El polígono evaluado presenta superposición o cercanía relevante con capas de restricción (áreas protegidas y/o microcuencas), por lo que se recomienda no aprobar el aprovechamiento solicitado en la zona indicada.";

  const obsLines = doc.splitTextToSize(obs, 180);
  doc.text(obsLines, 10, y);
  y += obsLines.length * 6 + 10;

  // Firma / pie
  doc.setFontSize(11);
  doc.text("__________________________________", 10, y); y += 6;
  doc.text("TÉCNICO GEOGRÁFICO ICF", 10, y); y += 6;
  doc.text("Unidad de Gestión Geográfica y Monitoreo", 10, y);

  // Exportar como base64 (data URI)
  const pdfDataUri = doc.output("datauristring"); // "data:application/pdf;base64,...."

  return pdfDataUri;
}
