import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import sakilaConfig from '../configs/sakilaConfig';
import uttLogo from '../assets/utt.png';
import { postData } from '../utils/fetchData';

const RecoveryCodeVerification = () => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forget-password', { replace: true });
    }
  }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
        }
    
        setIsLoading(true);
        setError('');
    
        try {
        await postData(
            sakilaConfig.auth.changepassword,
            { 
            email,
            code,
            password 
            },
            {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        );
    
        navigate('/login', { 
            state: { 
            successMessage: 'Contraseña actualizada correctamente. Inicie sesión con su nueva contraseña.' 
            }
        });
        } catch (err) {
        console.error("Password reset error:", err);
        setError(err.response?.data?.message || 'Error al actualizar la contraseña');
        } finally {
        setIsLoading(false);
        }
    };

    const handleCodeInput = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
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
                <p className="login-box-msg">Recuperación de contraseña</p>
                <p className="text-center text-muted mb-3">
                Hemos enviado un código a <strong>{email}</strong>. 
                Ingrese el código y su nueva contraseña.
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

                <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-control text-center"
                    placeholder="Código de 6 dígitos"
                    value={code}
                    onChange={handleCodeInput}
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

                <div className="input-group mb-3">
                    <input
                    type="password"
                    className="form-control"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    <div className="input-group-append">
                    <div className="input-group-text">
                        <span className="fas fa-lock"></span>
                    </div>
                    </div>
                </div>

                <div className="input-group mb-3">
                    <input
                    type="password"
                    className="form-control"
                    placeholder="Confirmar nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />
                    <div className="input-group-append">
                    <div className="input-group-text">
                        <span className="fas fa-lock"></span>
                    </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-block"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm mr-2" role="status"></span>
                            Actualizando...
                        </>
                        ) : 'Actualizar Contraseña'}
                    </button>
                    </div>
                </div>
                </form>

                <p className="mt-3 mb-0 text-center">
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

export default RecoveryCodeVerification;