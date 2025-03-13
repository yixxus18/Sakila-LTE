import useFetch from '../../hooks/useFetch';
import sakilaConfig from '../../configs/sakilaConfig';
import DataTable from '../../components/DataTable';

const CustomersReport = () => {
  const { data: customers } = useFetch(`${sakilaConfig.baseURL}/customers`);
  const { data: rentals } = useFetch(`${sakilaConfig.baseURL}/rentals`);
  const { data: payments } = useFetch(`${sakilaConfig.baseURL}/payments`);

  const customersReport = customers?.map(customer => {
    const customerRentals = rentals?.filter(rental => 
      rental.customer_id === customer.customer_id
    ) || [];

    const customerPayments = payments?.filter(payment => 
      payment.customer_id === customer.customer_id
    ) || [];

    const total_amount = customerPayments.reduce((sum, payment) => 
      sum + Number(payment.amount || 0), 0
    );

    const last_rental = customerRentals.length > 0 
      ? customerRentals.reduce((latest, rental) => 
          new Date(rental.rental_date) > new Date(latest.rental_date) ? rental : latest
        ).rental_date
      : null;

    return {
      ...customer,
      rental_count: customerRentals.length,
      total_amount,
      last_rental
    };
  }) || [];

  const columns = [
    { 
      header: 'Cliente',
      render: (item) => `${item.first_name} ${item.last_name}`
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Direccion', accessor: 'address' },
    { header: 'Total Alquileres', accessor: 'rental_count' },
    { 
      header: 'Total Pagado',
      accessor: 'total_amount',
      render: (item) => `$${Number(item.total_amount).toFixed(2)}`
    },
    { 
      header: 'Última Actividad',
      accessor: 'last_rental',
      render: (item) => item.last_rental ? new Date(item.last_rental).toLocaleDateString() : '-'
    }
  ];

  const totalCustomers = customersReport.length;
  const totalRentals = customersReport.reduce((sum, item) => sum + item.rental_count, 0);
  const totalAmount = customersReport.reduce((sum, item) => sum + Number(item.total_amount), 0);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Reporte de Clientes</h3>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="info-box bg-info">
              <span className="info-box-icon"><i className="fas fa-users"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Total Clientes</span>
                <span className="info-box-number">{totalCustomers}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-box bg-success">
              <span className="info-box-icon"><i className="fas fa-film"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Total Alquileres</span>
                <span className="info-box-number">{totalRentals}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-box bg-warning">
              <span className="info-box-icon"><i className="fas fa-dollar-sign"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Total Ingresos</span>
                <span className="info-box-number">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={customersReport} 
          isLoading={!customers || !rentals || !payments}
          error={null}
          allowCreate={false}
          allowDelete={false}
          allowEdit={false}
        />
      </div>
    </div>
  );
};

export default CustomersReport; 