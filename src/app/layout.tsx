import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "'t WEB OfferteMaker",
  description: "Simpele tool voor het genereren van gestandaardiseerde maatwerk offertes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
