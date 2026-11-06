import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { canAccessRoleRoute } from '../../services/permissions';

export const RequireRole: React.FC<{
  role: UserRole;
  children: React.ReactNode;
}> = ({ role, children }) => {
  const { session } = useApp();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!canAccessRoleRoute(session, role)) {
    return (
      <Navigate
        to="/login"
        state={{
          forbiddenRole: role,
          currentRole: session.role,
          attemptedPath: location.pathname,
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};
