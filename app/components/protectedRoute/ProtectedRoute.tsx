// components/ProtectedRoute.tsx
'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth, getUserRole } from '@/app/config/authentication';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin'; // Papel necessário para acessar a rota
}

const ProtectedRoute = ({ children, requiredRole = 'user' }: ProtectedRouteProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          // Usuário não autenticado, redirecionar para login
          router.push('/login');
          return;
        }

        if (requiredRole === 'admin') {
          // Verificar se o usuário tem papel de admin
          const role = await getUserRole(user.uid);
          if (role !== 'admin') {
            // Não é admin, redirecionar para página não autorizada
            router.push('/nao-autorizado');
            return;
          }
        }

        // Usuário autenticado e com permissões corretas
        setLoading(false);
      });

      return () => unsubscribe();
    };

    checkAuth();
  }, [router, requiredRole]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;