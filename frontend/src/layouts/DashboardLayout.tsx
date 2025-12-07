import { NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelectors';
import { logout } from '@/features/auth/authSlice';

const navItems = [
  { to: '/app/overview', label: 'Overview', roles: ['employee', 'manager', 'hr', 'finance', 'admin'] },
  { to: '/app/missions', label: 'Missions', roles: ['employee', 'manager', 'hr', 'finance', 'admin'] },
  { to: '/app/missions/new', label: 'New Mission', roles: ['employee'] },
  { to: '/app/admin/organizations', label: 'Organizations', roles: ['admin'] },
  { to: '/app/admin/users', label: 'Users', roles: ['admin'] },
  { to: '/app/notifications', label: 'Notifications', roles: ['employee', 'manager', 'hr', 'finance', 'admin'] }
];

export const DashboardLayout = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const filteredNav = navItems.filter((item) => (user ? item.roles.includes(user.role) : false));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-accent">Mission</span>Track
        </div>
        <nav>
          {filteredNav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="logout-btn" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </aside>
      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="page-subtitle">Smart mission management</p>
            <h1 className="page-title">Welcome back, {user?.fullName ?? 'Team Member'}</h1>
          </div>
          <div className="user-pill">
            <span>{user?.role.toUpperCase()}</span>
          </div>
        </header>
        <section className="page-body">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

