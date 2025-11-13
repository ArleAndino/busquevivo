import type { ReactNode } from "react";
import ClientLayout from "./components/ClientLayout"; // <- Agregado: ajusta la ruta si es necesario


export const metadata = {
  title: "Bosque Vivo HN",
  description: "Sistema de Monitoreo y Denuncia Ambiental de Honduras",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
        <body suppressHydrationWarning={true}>

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
