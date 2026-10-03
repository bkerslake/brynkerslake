import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bryn Kerslake",
  description: "A personal site for Bryn Kerslake.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
