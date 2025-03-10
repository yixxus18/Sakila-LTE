import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(
      'hold-transition',
      'sidebar-mini',
      'layout-fixed',
      'layout-navbar-fixed'
    );

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        document.body.classList.remove('sidebar-collapse');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.className = '';
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
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Sakila Admin</h1>
              </div>
            </div>
          </div>
        </div>

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

export default Layout; 