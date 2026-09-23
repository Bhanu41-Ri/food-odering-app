import { Navigate, useLocation, useParams } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { isStaffRole } from '../utils/constants';

function restaurantIdOf(user) {
  const r = user?.restaurant;
  if (!r) return '';
  return String(r._id || r);
}

/**
 * Public storefront pages (home, browse restaurants). Guests and customers OK.
 * Staff stay in the dashboard window, except they may preview their own
 * restaurant page at /restaurants/:theirRestaurantId.
 */
export default function StaffAwayFromStorefront({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const params = useParams();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Loading..." />
      </div>
    );
  }

  if (isAuthenticated && isStaffRole(user?.role)) {
    const path = location.pathname;
    const ownId = restaurantIdOf(user);
    const viewingOwnStore =
      Boolean(ownId) &&
      path.startsWith('/restaurants/') &&
      String(params.id || path.split('/')[2] || '') === ownId;

    if (path === '/' || path === '/restaurants' || path.startsWith('/restaurants/')) {
      if (!viewingOwnStore) {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return children;
}
