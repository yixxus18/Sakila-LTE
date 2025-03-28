import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const baseClasses = ['sidebar-mini', 'layout-fixed', 'layout-navbar-fixed'];
    
    // Agregar clases base sin eliminar otras clases (como modal-open)
    const currentClasses = document.body.className.split(' ').filter(cls => 
      !['sidebar-collapse', 'sidebar-open', 'sidebar-mini', 'layout-fixed', 'layout-navbar-fixed'].includes(cls)
    );
    
    document.body.className = [...currentClasses, ...baseClasses].join(' ');

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        document.body.classList.remove('sidebar-collapse');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // No limpiar todas las clases al desmontar
      baseClasses.forEach(cls => document.body.classList.remove(cls));
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth > 768) {
      document.body.classList.toggle('sidebar-collapse', !isSidebarOpen);
    } else {
      document.body.classList.toggle('sidebar-open', isSidebarOpen);
    }
  }, [isSidebarOpen]);

  return (
    <div className="wrapper">
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="content-wrapper">
        <div className="content">
          <div className="container-fluid">
            {children}
          </div>
        </div>
      </div>
      <Footer />
      <aside className="control-sidebar control-sidebar-dark">
      </aside>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout; 