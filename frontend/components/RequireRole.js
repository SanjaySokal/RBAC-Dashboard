'use client';

import { useAuth } from '../lib/auth-context.js';

export function RequireRole({ children, roles = [], fallback = null }) {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  // If no user is authenticated, show fallback
  if (!user) {
    return fallback;
  }

  // If no specific roles are required, show children
  if (roles.length === 0) {
    return children;
  }

  // Check if user has any of the required roles
  const hasRequiredRole = roles.includes(user.role);

  // If user has required role, show children, otherwise show fallback
  return hasRequiredRole ? children : fallback;
}

// Convenience components for specific roles
export function RequireAdmin({ children, fallback = null }) {
  return <RequireRole roles={['admin']} fallback={fallback}>{children}</RequireRole>;
}

export function RequireEditor({ children, fallback = null }) {
  return <RequireRole roles={['editor', 'admin']} fallback={fallback}>{children}</RequireRole>;
}

export function RequireViewer({ children, fallback = null }) {
  return <RequireRole roles={['viewer', 'editor', 'admin']} fallback={fallback}>{children}</RequireRole>;
}
