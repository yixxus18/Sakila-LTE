import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Acceso Denegado</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/">Inicio</Link>
                </li>
                <li className="breadcrumb-item active">Acceso Denegado</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="error-page">
          <h2 className="headline text-danger">403</h2>
          <div className="error-content">
            <h3>
              <i className="fas fa-exclamation-triangle text-danger"></i> ¡Oops! Acceso denegado.
            </h3>
            <p>
              No tienes permisos para acceder a esta página.
              Puedes <Link to="/">volver al inicio</Link> o contactar al administrador si crees que esto es un error.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccessDenied; 