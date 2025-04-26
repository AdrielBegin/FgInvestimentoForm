'use client';

import { useRouter } from 'next/navigation'; // Use a API de navegação moderna do App Router
import { useEffect, useState } from 'react';
import { auth, getUserRole } from '@/app/config/authentication';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin'; // Papel necessário para acessar a rota
}

const ProtectedRoute = ({ children, requiredRole = 'user' }: ProtectedRouteProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          router.push('/login');
          return;
        }

        try {
          const role = await getUserRole(user.uid);
          if (requiredRole === 'admin' && role !== 'admin') {
            router.push('/');
            return;
          }

          setAuthorized(true);
        } catch (err) {
          console.error('Erro ao verificar role:', err);
          router.push('/');
        } finally {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    };

    checkAuth();
  }, [router, requiredRole]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;