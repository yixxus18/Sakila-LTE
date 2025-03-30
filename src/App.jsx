import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ROLES } from './authProvider';
import Layout from './components/Layout';
import { RoleBasedRoute, PublicRoute, ReadOnlyRoute } from './components/ProtectedRoutes';
import Home from './pages/Home';
import FilmList from './pages/films/FilmList';
import Categories from './pages/films/Categories';
import Languages from './pages/films/Languages';
import CustomerList from './pages/customers/CustomerList';
import Rentals from './pages/customers/Rentals';
import Payments from './pages/customers/Payments';
import StoreList from './pages/stores/StoreList';
import Staff from './pages/stores/Staff';
import Inventory from './pages/stores/Inventory';
import SalesReport from './pages/reports/SalesReport';
import RentalsReport from './pages/reports/RentalsReport';
import CustomersReport from './pages/reports/CustomersReport';
import Actors from './pages/films/Actors';
import Cities from './pages/addresses/Cities';
import Countries from './pages/addresses/Countries';
import Addresses from './pages/addresses/Addresses';
import Login from './pages/Login';
import TwoFactor from './pages/twofactor';
import ForgetPassword from './pages/forgetpassword';
import AccessDenied from './pages/AccessDenied';
import RecoveryCodeVerification from './pages/RecoveryCodeVerification';

import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Ruta inicial accesible para todos */}
            <Route path="/" element={<Home />} />
            
            {/* Página de acceso denegado */}
            <Route path="/acceso-denegado" element={<AccessDenied />} />
            
            {/* Rutas relacionadas con películas - accesibles para administradores, clientes e invitados (solo lectura) */}
            <Route element={<ReadOnlyRoute />}>
              <Route path="/films" element={<FilmList />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/languages" element={<Languages />} />
              <Route path="/actors" element={<Actors />} />
              <Route path="/inventory" element={<Inventory />} />
            </Route>

            {/* Rutas de direcciones - solo accesibles para administradores */}
            <Route element={<RoleBasedRoute roles={[ROLES.ADMIN]} />}>
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/cities" element={<Cities />} />
              <Route path="/countries" element={<Countries />} />
            </Route>
            
            {/* Rutas de clientes - accesibles para administradores */}
            <Route element={<RoleBasedRoute roles={[ROLES.ADMIN]} />}>
              <Route path="/customers" element={<CustomerList />} />
            </Route>
            
            {/* Rutas de alquileres/pagos - accesibles para administradores y clientes */}
            <Route element={<RoleBasedRoute roles={[ROLES.ADMIN, ROLES.CUSTOMER]} />}>
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/payments" element={<Payments />} />
            </Route>
            
            {/* Rutas de tiendas y personal - solo accesibles para administradores */}
            <Route element={<RoleBasedRoute roles={[ROLES.ADMIN]} />}>
              <Route path="/stores" element={<StoreList />} />
              <Route path="/staff" element={<Staff />} />
            </Route>

            {/* Rutas de reportes - solo accesibles para administradores */}
            <Route element={<RoleBasedRoute roles={[ROLES.ADMIN]} />}>
              <Route path="/reports/sales" element={<SalesReport />} />
              <Route path="/reports/rentals" element={<RentalsReport />} />
              <Route path="/reports/customers" element={<CustomersReport />} />
            </Route>

            {/* Rutas de autenticación - accesibles solo para no autenticados */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/twofactor" element={<TwoFactor />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
              <Route path="/recovery-code-verification" element={<RecoveryCodeVerification />} />
            </Route>
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
