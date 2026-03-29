import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { type AppRole } from '@/types/rbac';

interface Props {
  children: React.ReactNode;
  requiredRoles: AppRole[];
  fallbackPath?: string;
}

export const RoleGuard = ({ children, requiredRoles, fallbackPath = '/dashboard' }: Props) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const hasRequiredRole = requiredRoles.some(role => hasRole(role));

  if (!hasRequiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
