// ** Agregar el uso de cookies para el token de autenticación
import { createContext, useEffect, useState } from "react";
import { parseCookies, destroyCookie } from "nookies"; 
import PropTypes from 'prop-types';
// ** Config
import { postData } from "./utils/fetchData";
import authConfig from "./configs/sakilaConfig";
import sakilaConfig from "./configs/sakilaConfig";

// Definición de permisos por rol
const ROLES = {
  ADMIN: 1,
  CUSTOMER: 2,
  GUEST: 3
};

// Mapeo de roles a nombres para mostrar
const ROLE_NAMES = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.CUSTOMER]: 'Cliente',
  [ROLES.GUEST]: 'Invitado'
};

const PERMISSIONS = {
  [ROLES.ADMIN]: {
    read: ['*'],
    write: ['*'],
    delete: ['*']
  },
  [ROLES.CUSTOMER]: {
    read: ['films', 'categories', 'actors', 'languages', 'inventory'],
    write: ['rentals', 'payments'],
    delete: []
  },
  [ROLES.GUEST]: {
    read: ['*'],
    write: [],
    delete: []
  }
};

const defaultProvider = {
  user: null,
  loading: true,
  role: null,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  hasPermission: () => false,
  isReadOnly: () => true,
  getRoleName: () => ''
};

const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [role, setRole] = useState(defaultProvider.role);

  // Función para verificar si un usuario tiene permiso para una acción en un recurso
  const hasPermission = (action, resource) => {
    if (!role || !PERMISSIONS[role]) return false;
    
    const permissions = PERMISSIONS[role][action];
    if (!permissions) return false;
    
    return permissions.includes('*') || permissions.includes(resource);
  };

  // Función para verificar si un usuario es de solo lectura
  const isReadOnly = () => {
    return role === ROLES.GUEST;
  };
  
  // Función para obtener el nombre del rol
  const getRoleName = () => {
    return ROLE_NAMES[role] || '';
  };

  useEffect(() => {
    const initAuth = async () => {
      const cookies = parseCookies();
      const storedToken = cookies[authConfig.storageTokenKeyName];

      if (!storedToken) {
        setLoading(false);
        // Si no hay token, asignar rol de invitado
        setRole(ROLES.GUEST);
        return;
      }

      try {
        const response = await postData(authConfig.meEndpoint, {}, {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        });
        
        const userData = response.user || response;
        
        if (!userData || !userData.id) {
          console.log("No se encontró información de usuario válida");
          handleLogout();
        } else {
          setUser(userData);
          
          // Asignar rol basado en la información del usuario
          // Por defecto, si el usuario tiene un token válido pero no especifica rol, asumimos que es cliente
          setRole(userData.role_id || ROLES.CUSTOMER);
        }
      } catch (error) {
        console.error("Error during auth check:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (params, errorCallback) => {
    try {
      console.log("Intentando iniciar sesión con:", params);
      
      const loginData = {
        email: params.email,
        password: params.password
      };

      const response = await postData(sakilaConfig.auth.login, loginData, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });
      
      console.log("Respuesta del servidor:", response);
      
      if (response?.token || response?.access_token) {
        return response;
      } else {
        console.error("Respuesta sin token:", response);
        throw new Error("No se recibió un token de acceso");
      }
    } catch (err) {
      console.error("Error en login:", err);
      if (errorCallback) {
        const errorMessage = err.message || "Error de autenticación";
        errorCallback(errorMessage.includes("401") ? "Credenciales inválidas" : errorMessage);
      }
      throw err;
    }
  };

  const handleLogout = () => {
    setUser(null);
    // Al cerrar sesión, restablecemos al rol de invitado
    setRole(ROLES.GUEST);
    destroyCookie(null, authConfig.storageTokenKeyName, {
      path: "/",
    });
    window.location.href = "/";
  };

  const values = {
    user,
    loading,
    role,
    setUser,
    login: handleLogin,
    logout: handleLogout,
    hasPermission,
    isReadOnly,
    getRoleName,
    ROLES
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};

export { AuthContext, AuthProvider, ROLES };