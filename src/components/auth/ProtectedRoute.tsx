import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "hooks/auth/useAuth";
import type { UserRole } from "types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Wraps a route and checks:
 * 1. User is logged in
 * 2. User role is in allowedRoles (if provided)
 *
 * Usage:
 * <ProtectedRoute allowedRoles={["admin"]}>
 * <ProtectedRoute allowedRoles={["admin", "manager"]}>
 */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/auth/sign-in" replace />;

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
