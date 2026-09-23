import { useEffect, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Store,
  UtensilsCrossed,
} from 'lucide-react';
import { APP_NAME } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';

const links = [
  { to: '/dashboard', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/restaurant', label: 'Restaurant', icon: Store },
  { to: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
  { to: '/dashboard/reviews', label: 'Reviews', icon: MessageSquare },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function resolveRestaurantId(user, restaurant) {
  return String(
    restaurant?._id ||
      restaurant?.id ||
      user?.restaurant?._id ||
      user?.restaurant ||
      ''
  );
}

export default function DashboardLayout() {
  const { user } = useAuth();
  const [restaurantId, setRestaurantId] = useState(() =>
    resolveRestaurantId(user, null)
  );

  useEffect(() => {
    let alive = true;
    const fromUser = resolveRestaurantId(user, null);
    if (fromUser) setRestaurantId(fromUser);

    dashboardService
      .getRestaurant()
      .then((data) => {
        if (!alive) return;
        const id = resolveRestaurantId(user, data);
        if (id) setRestaurantId(id);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [user]);

  const storefrontPath = restaurantId
    ? `/restaurants/${restaurantId}`
    : '/dashboard/restaurant';

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-brand-600 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-slate-200 bg-white lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-4 lg:block">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
              FD
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">{APP_NAME}</p>
              <p className="text-[11px] text-slate-500">Restaurant admin</p>
            </div>
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible lg:pb-6">
          {links.map(({ to, end, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t border-slate-100 p-4 lg:block">
          <p className="truncate text-sm font-medium text-slate-800">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
          <Link
            to={storefrontPath}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View storefront
          </Link>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-100 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
          <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          <Link
            to={storefrontPath}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View storefront
          </Link>
        </header>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
