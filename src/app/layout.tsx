import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Docencia IA - Universidad Diego Portales (CREA)",
  description: "Ecosistema Inteligente de Docencia, Actividades y Asistencia para la UDP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#F5F6F8]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
