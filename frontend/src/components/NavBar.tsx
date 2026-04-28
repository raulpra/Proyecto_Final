import { NavLink } from 'react-router-dom';
import type { AuthUser } from '../types/auth';
import './NavBar.css';

const icons = {
  home: (
    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
  ),
  users: (
    <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  car: (
    <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  ),
  login: (
    <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  ),
};

export default function NavBar({
  user,
  onLogout,
}: {
  user: AuthUser | null;
  onLogout: () => void;
}) {
  const initials = user?.nombre
    ? user.nombre.split(' ').map((w) => w[0]).slice(0, 2).join('')
    : user?.username?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <nav className="sti-navbar">
      <div className="sti-navbar-inner">
        {user && (
          <>
            <NavLink
              to="/"
              end
              className={({ isActive }) => 'nav-item-link' + (isActive ? ' active' : '')}
            >
              {icons.home} Dashboard
            </NavLink>
            <NavLink
              to="/clientes"
              className={({ isActive }) => 'nav-item-link' + (isActive ? ' active' : '')}
            >
              {icons.users} Clientes
            </NavLink>
            <NavLink
              to="/vehiculos"
              className={({ isActive }) => 'nav-item-link' + (isActive ? ' active' : '')}
            >
              {icons.car} Vehículos
            </NavLink>
            <NavLink
              to="/ordenes"
              className={({ isActive }) => 'nav-item-link' + (isActive ? ' active' : '')}
            >
              {icons.clipboard} Órdenes
            </NavLink>
            {user.rol === 'ADMIN' && (
              <NavLink
                to="/usuarios"
                className={({ isActive }) => 'nav-item-link' + (isActive ? ' active' : '')}
              >
                {icons.shield} Usuarios
              </NavLink>
            )}
          </>
        )}

        <div className="nav-spacer" />

        {user ? (
          <div className="nav-user-info">
            <div className="nav-user-label">
              <div className="nav-user-avatar">{initials}</div>
              <span>{user.nombre ?? user.username}</span>
              {user.rol && <span className="nav-role-tag">{user.rol}</span>}
            </div>
            <button className="btn-nav-logout" onClick={onLogout}>
              {icons.logout} Salir
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => 'nav-item-link' + (isActive ? ' active' : '')}
          >
            {icons.login} Iniciar sesión
          </NavLink>
        )}
      </div>
    </nav>
  );
}
