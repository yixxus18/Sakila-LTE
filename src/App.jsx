import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
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
import './styles/global.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Rutas de Películas */}
          <Route path="/films" element={<FilmList />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/actors" element={<Actors />} />

          {/* Rutas de Direcciones */}
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/countries" element={<Countries />} />
          
          {/* Rutas de Clientes */}
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/payments" element={<Payments />} />
          
          {/* Rutas de Tiendas */}
          <Route path="/stores" element={<StoreList />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/inventory" element={<Inventory />} />

          {/* Rutas de Reportes */}
          <Route path="/reports/sales" element={<SalesReport />} />
          <Route path="/reports/rentals" element={<RentalsReport />} />
          <Route path="/reports/customers" element={<CustomersReport />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
