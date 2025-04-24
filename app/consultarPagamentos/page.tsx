'use client';

import PagamentosConsulta from '@/app/components/consultarPagamento/PagamentosConsulta';

import TelaInicial from '@/app/components/paginaInicial/HomePag';

import dynamic from 'next/dynamic';

const ProtectedRoute = dynamic(
  () => import('../components/protectedRoute/ProtectedRoute'),
  { ssr: false }
);

export default function GetPagamento() {
  return (    
    <ProtectedRoute requiredRole='admin'>
      <PagamentosConsulta />
    </ProtectedRoute>
    
  );
}