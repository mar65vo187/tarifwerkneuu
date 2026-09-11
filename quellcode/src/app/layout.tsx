import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Instrument_Serif, Manrope } from "next/font/google";
import { SITE } from "@/lib/content";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "TarifWerk – Persönliche Beratung auf Augenhöhe | Immobilien, Solar, Energie & mehr",
    template: "%s | TarifWerk",
  },
  description:
    "TarifWerk prüft deine Möglichkeiten persönlich: Immobilien, Edelmetalle, Solar, Wärmepumpe, Internet, Mobilfunk, Strom, Gas und Versicherungen. Unabhängig, verständlich, mit festem Ansprechpartner – in Wiesbaden, Mainz, Frankfurt und deutschlandweit.",
  applicationName: "TarifWerk",
  keywords: [
    "TarifWerk",
    "persönliche Beratung",
    "Immobilienberatung Wiesbaden",
    "Photovoltaik Beratung Frankfurt",
    "Wärmepumpe Beratung Mainz",
    "Edelmetalle Beratung",
    "Tarifberatung Internet Mobilfunk",
    "Strom Gas Beratung",
    "Versicherungsberatung unabhängig",
  ],
  authors: [{ name: SITE.founder }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: SITE.name,
    title: "TarifWerk – Persönliche Beratung auf Augenhöhe",
    description:
      "Ein Ansprechpartner für Immobilien, Edelmetalle, Solar, Wärmepumpe, Internet, Mobilfunk, Energie und Versicherungen. Unabhängig und verständlich.",
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: "TarifWerk – Persönliche Beratung auf Augenhöhe",
    description: "Finde deinen persönlichen Berater. Unabhängig, verständlich, langfristig erreichbar.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#060b16",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={`${manrope.variable} ${instrument.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
