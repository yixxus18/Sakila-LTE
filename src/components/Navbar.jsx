import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navbar = ({ setIsSidebarOpen }) => {
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <button 
            className="nav-link" 
            onClick={() => setIsSidebarOpen(prev => !prev)}
            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            aria-label="Toggle Sidebar"
          >
            <i className="fas fa-bars"></i>
          </button>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/" className="nav-link">Inicio</Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/films" className="nav-link">Películas</Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/customers" className="nav-link">Clientes</Link>
        </li>
      </ul> 
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* User dropdown */}
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
            <i className="fas fa-user-circle"></i> <span className="sr-only">Menú de usuario</span>
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <span className="dropdown-item dropdown-header">Administrador</span>
            <div className="dropdown-divider"></div>
            <Link to="/staff" className="dropdown-item">
              <i className="fas fa-users-cog mr-2"></i> Personal
            </Link>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item" aria-label="Cerrar sesión de usuario">
              <i className="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  setIsSidebarOpen: PropTypes.func.isRequired
};

export default Navbar; 