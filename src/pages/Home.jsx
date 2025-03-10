import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import sakilaConfig from '../configs/sakilaConfig';

const Home = () => {
  const { data: films } = useFetch(sakilaConfig.films.getAll);
  const { data: customers } = useFetch(sakilaConfig.customers.getAll);
  const { data: rentals } = useFetch(`${sakilaConfig.baseURL}/rentals`);
  const { data: salesReport } = useFetch(`${sakilaConfig.baseURL}/payments`);

  const totalFilms = films?.length || 0;
  const activeCustomers = customers?.filter(c => c.active)?.length || 0;
  const overdueRentals = rentals?.filter(rental => 
    !rental.return_date && 
    new Date(rental.rental_date) < new Date()
  )?.length || 0;
  const totalSales = salesReport?.reduce((sum, item) => sum + parseFloat(item.total_sales || 0), 0) || 0;

  const topFilms = films?.slice(0, 5)?.map(film => ({
    film_id: film.film_id,
    title: film.title,
    category: film.category_name || 'Sin categoría',
    rentals: film.rental_count || 0
  })) || [];

  return (
    <>
      <div className="row">
        <div className="col-lg-3 col-6">
          <div className="small-box bg-info">
            <div className="inner">
              <h3>{totalFilms}</h3>
              <p>Películas Totales</p>
            </div>
            <div className="icon">
              <i className="fas fa-film"></i>
            </div>
            <Link to="/films" className="small-box-footer">
              Más información <i className="fas fa-arrow-circle-right"></i>
            </Link>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="small-box bg-success">
            <div className="inner">
              <h3>{activeCustomers}</h3>
              <p>Clientes Activos</p>
            </div>
            <div className="icon">
              <i className="fas fa-users"></i>
            </div>
            <Link to="/customers" className="small-box-footer">
              Más información <i className="fas fa-arrow-circle-right"></i>
            </Link>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="small-box bg-warning">
            <div className="inner">
              <h3>{overdueRentals}</h3>
              <p>Alquileres Vencidos</p>
            </div>
            <div className="icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <Link to="/rentals" className="small-box-footer">
              Más información <i className="fas fa-arrow-circle-right"></i>
            </Link>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="small-box bg-danger">
            <div className="inner">
              <h3>${totalSales.toFixed(2)}</h3>
              <p>Ventas Totales</p>
            </div>
            <div className="icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <Link to="/reports/sales" className="small-box-footer">
              Más información <i className="fas fa-arrow-circle-right"></i>
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header border-0">
              <h3 className="card-title">Alquileres por Categoría</h3>
            </div>
            <div className="card-body">
              <div style={{ height: '300px' }}>
                {/* Aquí implementaremos la gráfica más adelante */}
                <div className="text-center text-muted">
                  <i className="fas fa-chart-bar fa-3x mb-3"></i>
                  <p>Gráfica de alquileres por categoría</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header border-0">
              <h3 className="card-title">Películas Más Alquiladas</h3>
            </div>
            <div className="card-body table-responsive p-0">
              <table className="table table-striped table-valign-middle">
                <thead>
                  <tr>
                    <th>Película</th>
                    <th>Categoría</th>
                    <th>Alquileres</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {topFilms.map((film) => (
                    <tr key={film.film_id}>
                      <td>{film.title}</td>
                      <td>{film.category}</td>
                      <td>{film.rentals}</td>
                      <td>
                        <Link to={`/films/${film.film_id}`} className="text-muted">
                          <i className="fas fa-search"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home; 