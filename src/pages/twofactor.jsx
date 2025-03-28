import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { AuthContext } from '../authProvider'; 
import uttLogo from '../assets/utt.png'; 
import { postData } from '../utils/fetchData'; 
import sakilaConfig from '../configs/sakilaConfig'; 

const TwoFactor = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState(''); 
  const navigate = useNavigate();
  const location = useLocation(); 
  const { verifyCode } = useContext(AuthContext); 

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      console.warn("TwoFactor: No email found in location state. Redirecting to login.");
      navigate('/login', { replace: true }); 
    }
  }, [email, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
        setError("No se encontró el correo electrónico. Por favor, vuelva a iniciar sesión.");
        return;
    }
    setIsLoading(true);
    setError('');
    setResendStatus(''); 

    try {
      await verifyCode(email, code, setError); 
      console.log("TwoFactor: Verification successful. Navigating to home.");
      navigate('/'); 
    } catch (err) {
      console.error("TwoFactor component caught error during verification:", err);
       if (!error) {
          setError('Error al verificar el código. Inténtelo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
     if (!email) {
        setError("No se encontró el correo electrónico para reenviar el código.");
        return;
    }
    setIsLoading(true);
    setError('');
    setResendStatus('Reenviando...');

    try {
      await postData(sakilaConfig.auth.resendCode || `${sakilaConfig.baseURL}/resend-code`,
       { email: email }, 
       {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      });

      setResendStatus('El código ha sido reenviado a su correo electrónico.');
    } catch (err) {
      console.error('Error al reenviar código:', err);
      setError('Error al reenviar el código. Por favor, inténtelo de nuevo más tarde.');
      setResendStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 6) {
      setCode(value);
    }
  };


   if (!email) {
    return (
        <div className="login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Redirigiendo al inicio de sesión...</p>
        </div>
    );
  }

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
              Hemos enviado un código a <strong>{email}</strong>.
              Por favor, ingrese el código para continuar.
            </p>

            {error && (
              <div className="alert alert-danger alert-dismissible">
                <button type="button" className="close" onClick={() => setError('')} aria-label="Close">
                   <span aria-hidden="true">×</span>
                </button>
                <h5><i className="icon fas fa-ban"></i> Error</h5>
                {error}
              </div>
            )}

             {resendStatus && !error && ( 
              <div className="alert alert-info">
                {resendStatus}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text" 
                  inputMode="numeric" 
                  pattern="[0-9]*" 
                  className="form-control text-center"
                  placeholder="Código de 6 dígitos"
                  value={code}
                  onChange={handleInputChange}
                  maxLength={6}
                  required
                  autoComplete="one-time-code" 
                  aria-label="Código de verificación de 6 dígitos"
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
                    {isLoading && !resendStatus ? (
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
              <button
                 type="button"
                 onClick={handleResendCode}
                 className="btn btn-link" 
                 disabled={isLoading} 
               >
                ¿No recibió el código? Reenviar
              </button>
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