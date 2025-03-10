const NavbarToggle = ({ toggleSidebar }) => {
  return (
    <li className="nav-item">
      <button 
        className="nav-link btn" 
        style={{ 
          background: 'none', 
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem 1rem'
        }}
        onClick={toggleSidebar}
      >
        <i className="fas fa-bars"></i>
      </button>
    </li>
  );
};

export default NavbarToggle; 