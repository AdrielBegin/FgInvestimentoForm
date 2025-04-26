'use client';
import PagamentosConsulta from '@/app/components/consultarPagamento/PagamentosConsulta';
import ProtectedRoute from '../components/protectedRoute/ProtectedRoute';


export default function GetPagamentos() {
  return (    
    <ProtectedRoute requiredRole='admin'>
      <PagamentosConsulta />
    </ProtectedRoute>    
  );
}