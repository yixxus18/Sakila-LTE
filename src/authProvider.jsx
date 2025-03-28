import { createContext, useEffect, useState, useCallback } from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import PropTypes from "prop-types";
import { postData } from "./utils/fetchData";
import authConfig from "./configs/sakilaConfig";
import sakilaConfig from "./configs/sakilaConfig";

const ROLES = {
  ADMIN: 1,
  CUSTOMER: 2,
  GUEST: 3,
};

const ROLE_NAMES = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.CUSTOMER]: "Cliente",
  [ROLES.GUEST]: "Invitado",
};

const PERMISSIONS = {
  [ROLES.ADMIN]: {
    read: ["*"],
    write: ["*"],
    delete: ["*"],
  },
  [ROLES.CUSTOMER]: {
    read: [
      "films",
      "categories",
      "actors",
      "languages",
      "inventory",
      "rentals",
      "payments",
    ],
    write: ["rentals", "payments"],
    delete: [],
  },
  [ROLES.GUEST]: {
    read: ["films", "categories", "actors", "languages", "inventory"],
    write: [],
    delete: [],
  },
};

const storageUserKeyName = authConfig.storageUserKeyName || "userData";

const defaultProvider = {
  user: null,
  loading: true,
  role: ROLES.GUEST,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  verifyCode: () => Promise.resolve(),
  hasPermission: () => false,
  isReadOnly: () => true,
  getRoleName: () => "",
};

const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [role, setRoleState] = useState(defaultProvider.role);

  const setUser = useCallback((userData) => {
    setUserState(userData);
    if (userData) {
      try {
        setCookie(null, storageUserKeyName, JSON.stringify(userData), {
          maxAge: authConfig.tokenExpiration || 60 * 60 * 24,
          path: "/",
        });
      } catch (error) {
        console.error("Error storing user data in cookie:", error);
      }
    } else {
      destroyCookie(null, storageUserKeyName, { path: "/" });
    }
  }, []);

  const setRole = useCallback((newRole) => {
    setRoleState(newRole || ROLES.GUEST);
  }, []);

  const hasPermission = (action, resource) => {
    const currentRole = role || ROLES.GUEST;
    if (!PERMISSIONS[currentRole]) return false;

    const permissions = PERMISSIONS[currentRole][action];
    if (!permissions) return false;

    return permissions.includes("*") || permissions.includes(resource);
  };

  const isReadOnly = () => {
    return role === ROLES.GUEST;
  };

  const getRoleName = () => {
    return ROLE_NAMES[role] || ROLE_NAMES[ROLES.GUEST];
  };

  useEffect(() => {
    const initAuth = () => {
      setLoading(true);
      const cookies = parseCookies();
      const storedToken = cookies[authConfig.storageTokenKeyName];
      const storedUserData = cookies[storageUserKeyName];

      if (storedToken && storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          if (userData && userData.id && userData.role_id) {
            setUserState(userData);
            setRoleState(userData.role_id || ROLES.CUSTOMER);
            console.log("AuthProvider: Session restored from cookies.");
          } else {
            console.warn(
              "AuthProvider: Invalid user data found in cookies. Clearing session."
            );
            handleLogout();
          }
        } catch (error) {
          console.error(
            "AuthProvider: Error parsing user data from cookies. Clearing session.",
            error
          );
          handleLogout();
        }
      } else {
        setUserState(null);
        setRoleState(ROLES.GUEST);
        if (!storedToken)
          destroyCookie(null, authConfig.storageTokenKeyName, { path: "/" });
        if (!storedUserData)
          destroyCookie(null, storageUserKeyName, { path: "/" });
        console.log("AuthProvider: No active session found.");
      }
      setLoading(false);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (params, errorCallback) => {
    try {
      console.log("AuthProvider: Attempting login with:", params.email);
      const loginData = {
        email: params.email,
        password: params.password,
      };

      const response = await postData(sakilaConfig.auth.login, loginData, {
        Accept: "application/json",
        "Content-Type": "application/json",
      });

      console.log("AuthProvider: Login endpoint response:", response);

      if (response?.message) {
        return response;
      } else {
        console.warn(
          "AuthProvider: Login response missing 'message'. Assuming success for navigation."
        );
        return { message: "Login initiated, proceed to 2FA." };
      }
    } catch (err) {
      console.error("AuthProvider: Login failed:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Error de autenticación";
      if (errorCallback) {
        errorCallback(
          message.includes("401") ? "Credenciales inválidas" : message
        );
      }
      throw err;
    }
  };

  const handleVerifyCode = async (email, code, errorCallback) => {
    setLoading(true);
    try {
      console.log(`AuthProvider: Verifying code ${code} for email ${email}`);
      const verificationData = {
        email: email,
        code: code,
      };

      const response = await postData(
        sakilaConfig.auth.twofactorauth,
        verificationData,
        {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      );

      console.log("AuthProvider: Verification endpoint response:", response);

      const token = response?.token || response?.access_token;
      const userData = response?.staff;
      console.log("Staff: "+userData.staff_id)

      if (token && userData && userData.staff_id && userData.rol_id) {
        setCookie(null, authConfig.storageTokenKeyName, token, {
          maxAge: authConfig.tokenExpiration || 60 * 60 * 24,
          path: "/",
        });
        setUser(userData);
        setRole(userData.rol_id);
        console.log(
          "AuthProvider: Verification successful. User:",
          userData.staff_id,
          "Role:",
          userData.rol_id
        );
        setLoading(false);
        return response;
      } else {
        console.error(
          "AuthProvider: Verification response missing token or valid user data.",
          response
        );
        const message =
          response?.message ||
          "Código de verificación inválido o respuesta inesperada.";
        if (errorCallback) errorCallback(message);
        throw new Error(message);
      }
    } catch (err) {
      console.error("AuthProvider: Verification failed:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Error al verificar el código.";
      if (errorCallback) errorCallback(message);
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setRole(ROLES.GUEST);
    destroyCookie(null, authConfig.storageTokenKeyName, { path: "/" });
    destroyCookie(null, storageUserKeyName, { path: "/" });
    window.location.href = sakilaConfig.loginEndpoint || "/login";
  };

  const values = {
    user,
    loading,
    role,
    setUser,
    setRole,
    login: handleLogin,
    logout: handleLogout,
    verifyCode: handleVerifyCode,
    hasPermission,
    isReadOnly,
    getRoleName,
    ROLES,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider, ROLES };
