import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { AppRole, AuthUser } from '../types/auth';

export default function RequireRole({
  children,
  user,
  allowedRoles,
}: {
  children: ReactNode;
  user: AuthUser | null;
  allowedRoles: AppRole[];
}) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user.rol ?? '').toUpperCase() as AppRole | '';
  const isAllowed =
    allowedRoles.includes(role as AppRole) || role === 'ADMIN';

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
