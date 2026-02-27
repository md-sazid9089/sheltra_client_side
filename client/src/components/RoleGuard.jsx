import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/tokenUtils';

/**
 * RoleGuard component that checks if user has required role
 * Redirects to /unauthorized if user doesn't have the required role
 */
export default function RoleGuard({ children, allowedRoles = [] }) {
    const userRole = getUserRole();

    // If no allowed roles specified, allow all authenticated users
    if (!allowedRoles || allowedRoles.length === 0) {
        return children;
    }

    // Check if user role is in allowed roles (case-insensitive)
    const hasRequiredRole = allowedRoles.some(
        role => userRole?.toLowerCase() === role.toLowerCase()
    );

    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
