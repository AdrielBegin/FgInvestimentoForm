import "./globals.css";
import React from "react";
import Image from "next/image";
import icon from "../app/teste.ico";
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
        <Image alt="Logo da empresa" src={icon} />
        <meta name="description" content="Bem-vindo à shcool FG!" />
      </head>
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
