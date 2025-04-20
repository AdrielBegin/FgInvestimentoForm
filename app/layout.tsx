import "./globals.css";
import React from "react";
import '../app/config/firebaseClient';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <title>School FG</title>        
        <meta name="description" content="Bem-vindo à school FG!" />
      </head>
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
