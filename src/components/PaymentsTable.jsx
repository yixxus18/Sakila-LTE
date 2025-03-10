import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import sakilaConfig from '../configs/sakilaConfig';

const PaymentsTable = () => {
  const { data, isLoading, error } = useFetch(`${sakilaConfig.baseURL}/payments`);

  const columns = [
    { header: 'ID', accessor: 'payment_id' },
    { 
      header: 'Cliente',
      render: (item) => `${item.customer}`
    },
    { header: 'Alquiler ID', accessor: 'rental_id' },
    { 
      header: 'Monto',
      accessor: 'amount',
      render: (item) => `$${Number(item.amount).toFixed(2)}`
    },
    { 
      header: 'Fecha de Pago',
      accessor: 'payment_date',
      render: (item) => new Date(item.payment_date).toLocaleDateString()
    },
    { 
      header: 'Personal',
      render: (item) => `${item.staff} `
    }
  ];

  return (
    <div className="card-body">
      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        error={error}
      />
    </div>
  );
};

export default PaymentsTable; 