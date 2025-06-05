import "./globals.css";
import React from "react";
import { UserProvider } from "@/src/components/providers/Providers";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <title>FG School</title>
        <meta name="description" content="Bem-vindo à school FG!" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}