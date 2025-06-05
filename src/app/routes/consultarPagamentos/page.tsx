'use client';
import PagamentosConsulta from '@/src/components/consultarPagamento/PagamentosConsulta';
import ProtectedRoute from '@/src/components/protectedRoute/ProtectedRoute';

export default function GetPagamentos() {
  return (    
    <ProtectedRoute requiredRole='admin'>
      <PagamentosConsulta />
    </ProtectedRoute>    
  );
}