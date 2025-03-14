import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useFetch from '../hooks/useFetch';
import sakilaConfig from '../configs/sakilaConfig';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LoadingCard = () => (
  <div className="card">
    <div className="card-header border-0">
      <div className="placeholder-glow">
        <span className="placeholder col-6"></span>
      </div>
    </div>
    <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="sr-only">Cargando...</span>
        </div>
        <h5 className="text-primary">Cargando datos...</h5>
      </div>
    </div>
  </div>
);

const LoadingBox = ({ title, icon, color }) => (
  <div className={`small-box bg-${color}`}>
    <div className="inner">
      <h3>
        <div className="spinner-border spinner-border-sm text-light" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </h3>
      <p>{title}</p>
    </div>
    <div className="icon">
      <i className={`fas ${icon}`}></i>
    </div>
    <Link to="#" className="small-box-footer">
      Más información <i className="fas fa-arrow-circle-right"></i>
    </Link>
  </div>
);

LoadingBox.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};

const Home = () => {
  const { data: films, isLoading: loadingFilms } = useFetch(sakilaConfig.films.getAll);
  const { data: customers, isLoading: loadingCustomers } = useFetch(sakilaConfig.customers.getAll);
  const { data: rentals, isLoading: loadingRentals } = useFetch(`${sakilaConfig.baseURL}/rentals`);
  const { data: payments, isLoading: loadingPayments } = useFetch(`${sakilaConfig.baseURL}/payments`);

  const totalFilms = films?.length || 0;
  const activeCustomers = customers?.filter(c => c.active)?.length || 0;
  const overdueRentals = rentals?.filter(rental => 
    !rental.return_date && 
    new Date(rental.rental_date) < new Date()
  )?.length || 0;
  
  const totalSales = payments?.reduce((sum, payment) => 
    sum + parseFloat(payment.amount || 0), 0
  ) || 0;

  // Calcular estadísticas de alquiler por película
  const rentalStatsByFilm = {};

  rentals?.forEach(rental => {
    if (rental.film_title) {
      if (!rentalStatsByFilm[rental.film_title]) {
        rentalStatsByFilm[rental.film_title] = {
          count: 0,
          totalDuration: 0,
          returnedCount: 0
        };
      }

      rentalStatsByFilm[rental.film_title].count++;

      if (rental.return_date) {
        const returnDate = new Date(rental.return_date);
        const rentalDate = new Date(rental.rental_date);
        const durationInDays = (returnDate - rentalDate) / (1000 * 60 * 60 * 24);
        
        rentalStatsByFilm[rental.film_title].totalDuration += durationInDays;
        rentalStatsByFilm[rental.film_title].returnedCount++;
      }
    }
  });

  // Preparar top películas más alquiladas
  const topFilms = Object.entries(rentalStatsByFilm)
    .map(([title, stats]) => {
      const filmInfo = films?.find(f => f.title === title) || {};
      return {
        film_id: filmInfo.film_id || 0,
        title: title,
        rentals: stats.count
      };
    })
    .sort((a, b) => b.rentals - a.rentals)
    .slice(0, 5);

  // Preparar datos para el gráfico de duración promedio
  const averageDurationByFilm = Object.entries(rentalStatsByFilm)
    .map(([title, stats]) => ({
      title,
      averageDuration: stats.returnedCount > 0 ? stats.totalDuration / stats.returnedCount : 0
    }))
    .filter(item => item.averageDuration > 0)
    .sort((a, b) => b.averageDuration - a.averageDuration)
    .slice(0, 10);

  const chartData = {
    labels: averageDurationByFilm.map(item => item.title),
    datasets: [
      {
        label: 'Duración Promedio (días)',
        data: averageDurationByFilm.map(item => item.averageDuration.toFixed(1)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Hacer la gráfica horizontal
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 10 Películas por Tiempo de Retención',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.formattedValue} días`
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Días Promedio'
        }
      },
      y: {
        ticks: {
          callback: function(value) {
            const label = this.getLabelForValue(value);
            if (label.length > 20) {
              return label.substr(0, 20) + '...';
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-3 col-6">
          {loadingFilms ? (
            <LoadingBox 
              title="Películas Totales"
              icon="fa-film"
              color="info"
            />
          ) : (
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
          )}
        </div>

        <div className="col-lg-3 col-6">
          {loadingCustomers ? (
            <LoadingBox 
              title="Clientes Activos"
              icon="fa-users"
              color="success"
            />
          ) : (
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
          )}
        </div>

        <div className="col-lg-3 col-6">
          {loadingRentals ? (
            <LoadingBox 
              title="Alquileres Vencidos"
              icon="fa-shopping-cart"
              color="warning"
            />
          ) : (
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
          )}
        </div>

        <div className="col-lg-3 col-6">
          {loadingPayments ? (
            <LoadingBox 
              title="Ventas Totales"
              icon="fa-dollar-sign"
              color="danger"
            />
          ) : (
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
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          {loadingRentals ? (
            <LoadingCard />
          ) : (
            <div className="card">
              <div className="card-header border-0">
                <h3 className="card-title">Tiempo Promedio de Retención</h3>
              </div>
              <div className="card-body">
                <div style={{ height: '400px' }}>
                  {averageDurationByFilm.length > 0 ? (
                    <Bar data={chartData} options={chartOptions} />
                  ) : (
                    <div className="text-center text-muted">
                      <i className="fas fa-chart-bar fa-3x mb-3"></i>
                      <p>No hay datos disponibles</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-6">
          {loadingRentals || loadingFilms ? (
            <LoadingCard />
          ) : (
            <div className="card">
              <div className="card-header border-0">
                <h3 className="card-title">Películas Más Alquiladas</h3>
              </div>
              <div className="card-body table-responsive p-0">
                <table className="table table-striped table-valign-middle">
                  <thead>
                    <tr>
                      <th>Película</th>
                      <th>Alquileres</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topFilms.map((film) => (
                      <tr key={film.film_id}>
                        <td>{film.title}</td>
                        <td>{film.rentals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home; 