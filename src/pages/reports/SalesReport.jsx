import useFetch from '../../hooks/useFetch';
import sakilaConfig from '../../configs/sakilaConfig';
import DataTable from '../../components/DataTable';

const SalesReport = () => {
  const { data: payments } = useFetch(`${sakilaConfig.baseURL}/payments`);
  const { data: categories } = useFetch(`${sakilaConfig.baseURL}/categories`);

  const salesByCategory = categories?.map(category => {
    const categoryPayments = payments?.filter(payment => 
      payment.film_category === category.name
    ) || [];

    const total_sales = categoryPayments.reduce((sum, payment) => 
      sum + Number(payment.amount || 0), 0
    );

    const rental_count = categoryPayments.length;

    return {
      category: category.name,
      total_sales,
      rental_count
    };
  }) || [];

  const columns = [
    { header: 'Categoría', accessor: 'category' },
    { 
      header: 'Total Ventas',
      accessor: 'total_sales',
      render: (item) => `$${Number(item.total_sales).toFixed(2)}`
    },
    { header: 'Total Alquileres', accessor: 'rental_count' }
  ];

  const totalSales = salesByCategory.reduce((sum, item) => sum + Number(item.total_sales || 0), 0);
  const totalRentals = salesByCategory.reduce((sum, item) => sum + Number(item.rental_count || 0), 0);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Reporte de Ventas por Categoría</h3>
        <div className="card-tools">
          <button type="button" className="btn btn-success btn-sm">
            <i className="fas fa-download mr-2"></i>
            Exportar Excel
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="info-box bg-info">
              <span className="info-box-icon"><i className="fas fa-dollar-sign"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Total Ventas</span>
                <span className="info-box-number">${totalSales.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="info-box bg-success">
              <span className="info-box-icon"><i className="fas fa-film"></i></span>
              <div className="info-box-content">
                <span className="info-box-text">Total Alquileres</span>
                <span className="info-box-number">{totalRentals}</span>
              </div>
            </div>
          </div>
        </div>
        <DataTable 
          columns={columns} 
          data={salesByCategory} 
          isLoading={!payments || !categories}
          error={null}
        />
      </div>
    </div>
  );
};

export default SalesReport; 