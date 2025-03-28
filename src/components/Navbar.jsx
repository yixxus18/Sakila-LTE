import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../authProvider';

const Navbar = ({ setIsSidebarOpen }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const handleLogout = (e) => {
    e.preventDefault();
    setIsUserDropdownOpen(false);
    logout();
  };

  const toggleUserDropdown = (e) => {
    e.preventDefault();
    setIsUserDropdownOpen(prev => !prev);
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
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

        {user && (
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/customers" className="nav-link">Clientes</Link>
          </li>
        )}

        {!user && (
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/login" className="nav-link">Iniciar Sesión</Link>
          </li>
        )}

      </ul>

      <ul className="navbar-nav ml-auto">
        {user && (
          <li className={`nav-item dropdown ${isUserDropdownOpen ? 'show' : ''}`}>
            <a
              className="nav-link"
              href="#"
              onClick={toggleUserDropdown}
              role="button"
              aria-haspopup="true"
              aria-expanded={isUserDropdownOpen}
            >
              <i className="fas fa-user-circle mr-1"></i>
              <span className='d-none d-sm-inline'>{user.first_name || user.email || 'Usuario'}</span>
            </a>
            <div className={`dropdown-menu dropdown-menu-right ${isUserDropdownOpen ? 'show' : ''}`}>
               <span className="dropdown-item disabled" tabIndex="-1" aria-disabled="true">
                 Logueado como: {user.email}
               </span>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
              </button>
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  setIsSidebarOpen: PropTypes.func.isRequired
};

export default Navbar;