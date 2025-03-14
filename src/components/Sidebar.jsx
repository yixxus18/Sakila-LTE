import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import uttLogo from '../assets/utt.png';
import userAvatar from '../assets/user2-160x160.jpg';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [openMenus, setOpenMenus] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [wasOpenBeforeHover, setWasOpenBeforeHover] = useState(false);

  const toggleSubmenu = (menuName, event) => {
    event.preventDefault();
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (isSidebarOpen || isHovered) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [isSidebarOpen, isHovered]);

  const handleMouseEnter = () => {
    setWasOpenBeforeHover(isSidebarOpen);
    setIsHovered(true);
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!wasOpenBeforeHover) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      />
      <aside 
        className={`main-sidebar sidebar-dark-primary elevation-4 ${isSidebarOpen ? 'sidebar-open' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link to="/" className="brand-link" onClick={closeSidebar}>
          <img
            src={uttLogo}
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: '.8' }}
          />
          <span className="brand-text font-weight-light">Sakila Admin</span>
        </Link>

        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img 
                src={userAvatar}
                className="img-circle elevation-2" 
                alt="User Image" 
              />
            </div>
            <div className="info">
              <Link to="#" className="d-block">Administrador</Link>
            </div>
          </div>

          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column">
              {/* Dashboard */}
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={closeSidebar}>
                  <i className="nav-icon fas fa-home"></i>
                  <p>Home</p>
                </Link>
              </li>

              {/* Películas */}
              <li className={`nav-item ${openMenus.movies ? 'menu-is-opening menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={(e) => toggleSubmenu('movies', e)}>
                  <i className="nav-icon fas fa-film"></i>
                  <p>Películas</p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/films" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Lista de Películas</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/categories" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Categorías</p>
                    </Link>
                  </li>
                 <li className="nav-item">
                   <Link to="/languages" className="nav-link" onClick={closeSidebar}>
                     <i className="far fa-circle nav-icon"></i>
                     <p>Idiomas</p>
                   </Link>
                 </li>
                 <li className="nav-item">
                   <Link to="/actors" className="nav-link" onClick={closeSidebar}>
                     <i className="far fa-circle nav-icon"></i>
                     <p>Actores</p>
                   </Link>
                 </li>
                </ul>
              </li>

              {/* Clientes */}
              <li className={`nav-item ${openMenus.customers ? 'menu-is-opening menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={(e) => toggleSubmenu('customers', e)}>
                  <i className="nav-icon fas fa-users"></i>
                  <p>Clientes</p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/customers" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Lista de Clientes</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/rentals" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Alquileres</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/payments" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Pagos</p>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Direcciones */}
              <li className={`nav-item ${openMenus.addresses ? 'menu-is-opening menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={(e) => toggleSubmenu('addresses', e)}>
                  <i className="nav-icon fas fa-map-marker-alt"></i>
                  <p>Direcciones</p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/countries" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Países</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/cities" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Ciudades</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/addresses" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Direcciones</p>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Tiendas */}
              <li className={`nav-item ${openMenus.stores ? 'menu-is-opening menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={(e) => toggleSubmenu('stores', e)}>
                  <i className="nav-icon fas fa-store"></i>
                  <p>Tiendas</p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/stores" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Lista de Tiendas</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/staff" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Personal</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/inventory" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Inventario</p>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Reportes */}
              <li className={`nav-item ${openMenus.reports ? 'menu-is-opening menu-open' : ''}`}>
                <a href="#" className="nav-link" onClick={(e) => toggleSubmenu('reports', e)}>
                  <i className="nav-icon fas fa-chart-bar"></i>
                  <p>Reportes</p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/reports/sales" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Ventas</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/reports/rentals" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Alquileres</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/reports/customers" className="nav-link" onClick={closeSidebar}>
                      <i className="far fa-circle nav-icon"></i>
                      <p>Clientes</p>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired
};

export default Sidebar;
