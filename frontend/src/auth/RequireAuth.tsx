import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { AuthUser } from '../types/auth';

export default function RequireAuth({
  children,
  user,
}: {
  children: ReactNode;
  user: AuthUser | null;
}) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
