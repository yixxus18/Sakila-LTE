import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../authProvider';
import uttLogo from '../assets/utt.png';
import { postData } from '../utils/fetchData';
import sakilaConfig from '../configs/sakilaConfig';
import { setCookie } from 'nookies';

const TwoFactor = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setRole } = useContext(AuthContext);
  
  // Obtener el email y token del state de la navegación
  const email = location.state?.email || '';
  const token = location.state?.token || '';
  
  // Si no hay email o token, redirigir al login
  if (!email || !token) {
    navigate('/login');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await postData(sakilaConfig.auth.twofactorauth, {
        email,
        code
      }, {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      
      // Si la autenticación de dos factores es exitosa
      if (response?.token || response?.access_token) {
        const finalToken = response.token || response.access_token;
        
        // Guardar el token definitivo
        setCookie(null, sakilaConfig.auth.storageTokenKeyName, finalToken, {
          maxAge: 60 * 60 * 24 * 365, // 1 año
          path: '/',
        });
        
        if (response.user) {
          setUser(response.user);
          setRole(response.user.role_id || 2); // Default a Cliente si no hay rol
        }
        
        // Redirigir a la página principal
        navigate('/');
      } else {
        setError('Código de verificación inválido');
      }
    } catch (err) {
      console.error('Error en verificación de dos factores:', err);
      setError('Error al verificar el código. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      await postData(sakilaConfig.auth.resendCode || `${sakilaConfig.baseURL}/resend-code`, {
        email
      }, {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      
      // Mostrar mensaje de éxito
      alert('El código ha sido reenviado a su correo electrónico');
    } catch (err) {
      console.error('Error al reenviar código:', err);
      setError('Error al reenviar el código. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el cambio en el código
  const handleInputChange = (e) => {
    // Asegurarse de que solo se ingresen números
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    // Limitar a 6 dígitos
    if (value.length <= 6) {
      setCode(value);
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '100vh' }}>
      <div className="login-box">
        <div className="login-logo">
          <Link to="/">
            <img src={uttLogo} alt="Sakila Logo" style={{ height: '60px', marginRight: '10px' }} />
            <b>Sakila</b> Admin
          </Link>
        </div>
        
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Verificación de dos factores</p>
            <p className="text-center text-muted mb-3">
              Hemos enviado un código de verificación a su correo electrónico.
              Por favor, ingrese el código para continuar.
            </p>

            {error && (
              <div className="alert alert-danger alert-dismissible">
                <button type="button" className="close" onClick={() => setError('')}>×</button>
                <h5><i className="icon fas fa-ban"></i> Error</h5>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control text-center"
                  placeholder="Ingrese el código de 6 dígitos"
                  value={code}
                  onChange={handleInputChange}
                  maxLength={6}
                  required
                  style={{ fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-key"></span>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-12 mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-block"
                    disabled={isLoading || code.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                        Verificando...
                      </>
                    ) : 'Verificar'}
                  </button>
                </div>
              </div>
            </form>

            <p className="mb-1 text-center">
              <a href="#" onClick={(e) => { e.preventDefault(); handleResendCode(); }} className="text-center">
                ¿No recibió el código? Reenviar
              </a>
            </p>
            
            <p className="mb-0 text-center">
              <Link to="/login" className="text-center">
                Regresar al inicio de sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactor;