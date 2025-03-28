import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../authProvider"; 
import uttLogo from "../assets/utt.png";
import sakilaConfig from "../configs/sakilaConfig";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData, setError); 
      console.log("Login successful, navigating to 2FA for:", formData.email);
      navigate("/twofactor", {
        state: {
          email: formData.email,
        },
      });

    } catch (err) {
      console.error("Login component caught error:", err);
      if (!error) {
        setError("Error al iniciar sesión. Intente de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-page" style={{ minHeight: "100vh" }}>
      <div className="login-box">
        <div className="login-logo">
          <Link to="/">
            <img
              src={uttLogo}
              alt="Sakila Logo"
              style={{ height: "60px", marginRight: "10px" }}
            />
            <b>Sakila</b> Admin
          </Link>
        </div>

        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">
              Inicie sesión para comenzar su sesión
            </p>

            {error && (
              <div className="alert alert-danger alert-dismissible">
                <button
                  type="button"
                  className="close"
                  onClick={() => setError("")}
                  aria-label="Close" 
                >
                  <span aria-hidden="true">×</span>
                </button>
                <h5>
                  <i className="icon fas fa-ban"></i> Error
                </h5>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Correo electrónico"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-label="Correo electrónico"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
              </div>

              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  aria-label="Contraseña"
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
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Verificando... 
                      </>
                    ) : (
                      "Continuar" 
                    )}
                  </button>
                </div>
              </div>
            </form>

            <p className="mt-3 mb-1"> 
              <Link to={sakilaConfig?.passwordrecuperation || "/forgetpassword"}>Olvidé mi contraseña</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;