import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import BarraAbajo from "./_life/BarraAbajo";
import Encabezado from "./_life/Encabezado";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Roboto es la letra de la web del IAE (iae.edu).
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IAE LIFE",
    template: "%s · IAE LIFE",
  },
  description:
    "La app para la vida escolar del IAE, creada por los estudiantes del AI Lab del Instituto Alberto Einstein.",
  applicationName: "IAE LIFE",
  appleWebApp: { title: "IAE LIFE", capable: true, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#1d3a8a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Encabezado />
        {children}
        <BarraAbajo />
      </body>
    </html>
  );
}
