import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AILQS — Customer Panel Concepts",
  description: "Interactive design concepts for the AILQS customer lead panel.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
