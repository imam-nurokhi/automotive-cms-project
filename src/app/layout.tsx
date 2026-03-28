import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoFlow – Sistem Manajemen Bengkel Premium",
  description: "Platform manajemen bengkel premium terpercaya di Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
