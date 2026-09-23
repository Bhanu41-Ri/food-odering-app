import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { isStaffRole } from '../utils/constants';

/**
 * Public storefront pages (home, browse restaurants). Guests and customers OK.
 * Logged-in restaurant partners / admins stay in the dashboard window.
 */
export default function StaffAwayFromStorefront({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading..." />
      </div>
    );
  }

  if (isAuthenticated && isStaffRole(user?.role)) {
    // Allow staff to open profile/notifications via other routes; block storefront
    const path = location.pathname;
    if (path === '/' || path.startsWith('/restaurants')) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
