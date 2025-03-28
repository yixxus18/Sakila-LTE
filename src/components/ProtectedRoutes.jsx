import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../authProvider';

// Componente para rutas que requieren autenticación
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children || <Outlet />;
};

// Componente para rutas que requieren un rol específico
export const RoleBasedRoute = ({ roles, children }) => {
  const { user, role, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Si el usuario no tiene el rol necesario, redirigir a página de acceso denegado
  if (roles && !roles.includes(role)) {
    return <Navigate to="/acceso-denegado" replace />;
  }
  
  return children || <Outlet />;
};

// Componente para rutas que son de solo lectura para ciertos roles
export const ReadOnlyRoute = ({ children }) => {
  const { isReadOnly } = useContext(AuthContext);
  
  // Pasamos una prop al children para indicar si es de solo lectura
  const childrenWithProps = children ? React.cloneElement(children, { readOnly: isReadOnly() }) : null;
  
  return childrenWithProps || <Outlet context={{ readOnly: isReadOnly() }} />;
};

// Componente para rutas que son accesibles solo por visitantes (no autenticados)
export const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node
};

RoleBasedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node
};

ReadOnlyRoute.propTypes = {
  children: PropTypes.node
};

PublicRoute.propTypes = {
  children: PropTypes.node
}; 