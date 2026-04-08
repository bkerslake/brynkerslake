import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";

const perfectlyNineties = localFont({
  src: [
    {
      path: "./fonts/perfectly-nineties-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/perfectly-nineties-regular-italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/perfectly-nineties-semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/perfectly-nineties-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/perfectly-nineties-bold-italic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/perfectly-nineties-black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-perfectly-nineties",
});

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
      <body className={perfectlyNineties.variable}>{children}</body>
    </html>
  );
}
