import { useState } from 'react';
import { Link } from 'react-router-dom';
import uttLogo from '../assets/utt.png';
import { postData } from '../utils/fetchData';
import sakilaConfig from '../configs/sakilaConfig';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await postData(sakilaConfig.auth.passwordrecuperation, { email }, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      });
      
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error al solicitar recuperación de contraseña:', err);
      setError('Error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
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
            <p className="login-box-msg">
              {isSubmitted 
                ? 'Se ha enviado un enlace a su correo electrónico para restablecer la contraseña.' 
                : 'Ingrese su correo electrónico para restablecer su contraseña.'}
            </p>

            {error && (
              <div className="alert alert-danger alert-dismissible">
                <button type="button" className="close" onClick={() => setError('')}>×</button>
                <h5><i className="icon fas fa-ban"></i> Error</h5>
                {error}
              </div>
            )}

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope"></span>
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
                          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                          Procesando...
                        </>
                      ) : 'Recuperar contraseña'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '3rem' }}></i>
                <p>Revise su correo electrónico para seguir las instrucciones.</p>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => setIsSubmitted(false)}
                >
                  Solicitar de nuevo
                </button>
              </div>
            )}

            <p className="mt-3 mb-1">
              <Link to="/login">Volver al login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;