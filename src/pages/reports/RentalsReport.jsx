import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import sakilaConfig from '../../configs/sakilaConfig';
import DataTable from '../../components/DataTable';

const RentalsReport = () => {
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });

  const { data, isLoading, error } = useFetch(`${sakilaConfig.baseURL}/rentals`);

  const columns = [
    { 
      header: 'Fecha Alquiler',
      accessor: 'rental_date',
      render: (item) => new Date(item.rental_date).toLocaleDateString()
    },
    { 
      header: 'Fecha Devolución',
      accessor: 'return_date',
      render: (item) => item.return_date ? new Date(item.return_date).toLocaleDateString() : 'Pendiente'
    },
    { 
      header: 'Cliente',
      accessor: 'customer_name'
    },
    { header: 'Película', accessor: 'film_title' },
    { 
      header: 'Estado',
      render: (item) => {
        if (!item.return_date) {
          const rentalDate = new Date(item.rental_date);
          // Consideramos que está vencido si han pasado más de 3 días
          const isOverdue = (new Date() - rentalDate) > (3 * 24 * 60 * 60 * 1000);
          return isOverdue ? 'Vencido' : 'Activo';
        }
        return 'Devuelto';
      }
    },
    { 
      header: 'Días',
      render: (item) => {
        if (!item.return_date) {
          const days = Math.floor((new Date() - new Date(item.rental_date)) / (1000 * 60 * 60 * 24));
          return days;
        }
        const days = Math.floor((new Date(item.return_date) - new Date(item.rental_date)) / (1000 * 60 * 60 * 24));
        return days;
      }
    }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredData = data?.filter(item => {
    if (filters.status) {
      const rentalDate = new Date(item.rental_date);
      const isOverdue = !item.return_date && (new Date() - rentalDate) > (3 * 24 * 60 * 60 * 1000);
      const status = !item.return_date 
        ? (isOverdue ? 'overdue' : 'active')
        : 'returned';
      if (status !== filters.status) return false;
    }
    if (filters.startDate && new Date(item.rental_date) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(item.rental_date) > new Date(filters.endDate)) return false;
    return true;
  });

  const totalRentals = filteredData?.length || 0;
  const activeRentals = filteredData?.filter(item => {
    if (!item.return_date) {
      const rentalDate = new Date(item.rental_date);
      // Un alquiler está activo si no tiene fecha de devolución y no han pasado más de 3 días
      return (new Date() - rentalDate) <= (3 * 24 * 60 * 60 * 1000);
    }
    return false;
  })?.length || 0;
  
  const overdueRentals = filteredData?.filter(item => {
    if (!item.return_date) {
      const rentalDate = new Date(item.rental_date);
      // Un alquiler está vencido si no tiene fecha de devolución y han pasado más de 3 días
      return (new Date() - rentalDate) > (3 * 24 * 60 * 60 * 1000);
    }
    return false;
  })?.length || 0;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Reporte de Alquileres</h3>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="info-box bg-info">
              <span className="info-box-icon"><i className="fas fa-film"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Total Alquileres</span>
                <span className="info-box-number">{totalRentals}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-box bg-success">
              <span className="info-box-icon"><i className="fas fa-check"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Alquileres Activos</span>
                <span className="info-box-number">{activeRentals}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-box bg-warning">
              <span className="info-box-icon"><i className="fas fa-exclamation"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Alquileres Vencidos</span>
                <span className="info-box-number">{overdueRentals}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3">
            <div className="form-group">
              <label>Fecha Inicio</label>
              <input 
                type="date" 
                className="form-control" 
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>Fecha Fin</label>
              <input 
                type="date" 
                className="form-control" 
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>Estado</label>
              <select 
                className="form-control"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Todos</option>
                <option value="active">Activos</option>
                <option value="returned">Devueltos</option>
                <option value="overdue">Vencidos</option>
              </select>
            </div>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={filteredData || []} 
          isLoading={isLoading} 
          error={error}
          allowCreate={false}
          allowDelete={false}
          allowEdit={false}
        />
      </div>
    </div>
  );
};

export default RentalsReport; 