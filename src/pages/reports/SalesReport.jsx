import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import sakilaConfig from '../../configs/sakilaConfig';
import DataTable from '../../components/DataTable';

const SalesReport = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  const { data: payments, isLoading, error } = useFetch(`${sakilaConfig.baseURL}/payments`);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredPayments = payments?.filter(payment => {
    const paymentDate = new Date(payment.payment_date);
    if (filters.startDate && paymentDate < new Date(filters.startDate)) return false;
    if (filters.endDate && paymentDate > new Date(filters.endDate)) return false;
    return true;
  }) || [];

  const columns = [
    { 
      header: 'Fecha de Pago',
      accessor: 'payment_date',
      render: (item) => new Date(item.payment_date).toLocaleString()
    },
    { header: 'Cliente', accessor: 'customer' },
    { header: 'Personal', accessor: 'staff' },
    { 
      header: 'Monto',
      accessor: 'amount',
      render: (item) => `$${Number(item.amount).toFixed(2)}`
    }
  ];

  const totalAmount = filteredPayments.reduce((sum, payment) => 
    sum + Number(payment.amount || 0), 0
  );

  const totalTransactions = filteredPayments.length;

  const averageAmount = totalTransactions > 0 
    ? totalAmount / totalTransactions 
    : 0;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Reporte de Ventas</h3>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="info-box bg-info">
              <span className="info-box-icon"><i className="fas fa-dollar-sign"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Total Ventas</span>
                <span className="info-box-number">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-box bg-success">
              <span className="info-box-icon"><i className="fas fa-shopping-cart"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Total Transacciones</span>
                <span className="info-box-number">{totalTransactions}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-box bg-warning">
              <span className="info-box-icon"><i className="fas fa-chart-line"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Promedio por Venta</span>
                <span className="info-box-number">${averageAmount.toFixed(2)}</span>
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
        </div>

        <DataTable 
          columns={columns} 
          data={filteredPayments} 
          isLoading={isLoading}
          error={error}
          allowCreate={false}
          allowEdit={false}
          allowDelete={false}
        />
      </div>
    </div>
  );
};

export default SalesReport; 