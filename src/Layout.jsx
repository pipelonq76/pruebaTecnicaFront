import { Outlet, Link, useLocation } from 'react-router-dom';
import './Layout.css';

export const Layout = () => {
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="layout-container">
      {!isHome && (
        <nav className="navbar">
          <div className="navbar-content">
            <Link to="/" className="navbar-brand">
              🏍️ Taller Motos
            </Link>
            <div className="navbar-links">
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Inicio
              </Link>
              <Link
                to="/ordenes"
                className={`nav-link ${location.pathname === '/ordenes' ? 'active' : ''}`}
              >
                Órdenes
              </Link>
              <Link
                to="/clientes"
                className={`nav-link ${location.pathname === '/clientes' ? 'active' : ''}`}
              >
                Clientes
              </Link>
              <Link
                to="/motos"
                className={`nav-link ${location.pathname === '/motos' ? 'active' : ''}`}
              >
                Motos
              </Link>
            </div>
          </div>
        </nav>
      )}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
