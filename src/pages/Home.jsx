import { Link } from 'react-router-dom';
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

const Home = () => {
  const { data: films } = useFetch(sakilaConfig.films.getAll);
  const { data: customers } = useFetch(sakilaConfig.customers.getAll);
  const { data: rentals } = useFetch(`${sakilaConfig.baseURL}/rentals`);
  const { data: payments } = useFetch(`${sakilaConfig.baseURL}/payments`);

  const totalFilms = films?.length || 0;
  const activeCustomers = customers?.filter(c => c.active)?.length || 0;
  const overdueRentals = rentals?.filter(rental => 
    !rental.return_date && 
    new Date(rental.rental_date) < new Date()
  )?.length || 0;
  
  const totalSales = payments?.reduce((sum, payment) => 
    sum + parseFloat(payment.amount || 0), 0
  ) || 0;

  const topFilms = films?.slice(0, 5)?.map(film => ({
    film_id: film.film_id,
    title: film.title,
    category: film.category_name || 'Sin categoría',
    rentals: film.rental_count || 0
  })) || [];

  // Calcular duración promedio de alquileres por película
  const rentalDurationByFilm = {};
  const rentalCountByFilm = {};

  rentals?.forEach(rental => {
    if (rental.return_date && rental.film_title) {
      const returnDate = new Date(rental.return_date);
      const rentalDate = new Date(rental.rental_date);
      const durationInDays = (returnDate - rentalDate) / (1000 * 60 * 60 * 24);

      if (!rentalDurationByFilm[rental.film_title]) {
        rentalDurationByFilm[rental.film_title] = 0;
        rentalCountByFilm[rental.film_title] = 0;
      }

      rentalDurationByFilm[rental.film_title] += durationInDays;
      rentalCountByFilm[rental.film_title]++;
    }
  });

  // Calcular el promedio y ordenar por duración
  const averageDurationByFilm = Object.entries(rentalDurationByFilm)
    .map(([title, totalDuration]) => ({
      title,
      averageDuration: totalDuration / rentalCountByFilm[title]
    }))
    .sort((a, b) => b.averageDuration - a.averageDuration)
    .slice(0, 10); // Top 10 películas

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
                  </tr>
                </thead>
                <tbody>
                  {topFilms.map((film) => (
                    <tr key={film.film_id}>
                      <td>{film.title}</td>
                      <td>{film.category}</td>
                      <td>{film.rentals}</td>
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