import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import sakilaConfig from '../configs/sakilaConfig';

const AddressesTable = () => {
  const { data, isLoading, error } = useFetch(sakilaConfig.addresses.getAll);
  const citiesData = useFetch(sakilaConfig.cities.getAll);

  const columns = [
    { header: 'ID', accessor: 'address_id' },
    { 
      header: 'Dirección',
      render: (item) => (
        <div>
          <div>{item.address}</div>
          {item.address2 && <div>{item.address2}</div>}
          <div>{item.district}</div>
        </div>
      )
    },
    { header: 'Distrito', accessor: 'district' },
    { 
      header: 'Ciudad',
      accessor: 'city_id',
      render: (item) => (
        citiesData.data?.find(c => c.city_id === item.city_id)?.city || 'N/A'
      )
    },
    { 
      header: 'Código Postal',
      accessor: 'postal_code',
      render: (item) => item.postal_code || 'N/A'
    },
    { 
      header: 'Teléfono',
      accessor: 'phone',
      render: (item) => item.phone || 'N/A'
    },
    { 
      header: 'Última Actualización', 
      accessor: 'last_update',
      render: (item) => new Date(item.last_update).toLocaleString()
    }
  ];

  return (
    <div className="card-body">
      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        error={error}
        title="Direcciones"
        allowCreate= {false}
        allowEdit = {false}
        allowDelete = {false}
      />
    </div>
  );
};

export default AddressesTable;