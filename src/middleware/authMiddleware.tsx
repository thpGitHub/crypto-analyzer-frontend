import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export function withAuth(WrappedComponent: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.replace('/login');
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return <div>Chargement...</div>; // Vous pouvez remplacer par un composant de loading
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 