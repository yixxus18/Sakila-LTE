import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import sakilaConfig from '../configs/sakilaConfig';

const InventoryTable = () => {
  const { data, isLoading, error } = useFetch(`${sakilaConfig.baseURL}/inventory`);

  const columns = [
    { header: 'ID', accessor: 'inventory_id' },
    { header: 'Película', accessor: 'film.title' },
    { 
      header: 'Tienda',
      accessor: 'store_id',
      render: (item) => `Tienda #${item.store_id}`
    },
    { 
      header: 'Estado',
      render: (item) => item.available ? 'Disponible' : 'Alquilado'
    },
    { 
      header: 'Última Actualización', 
      accessor: 'last_update',
      render: (item) => item.last_update ? new Date(item.last_update).toLocaleDateString() : '-'
    }
  ];

  return (
    <div className="card-body">
      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        error={error}
        allowCreate={false}
        allowEdit={false}
        allowDelete={false}
      />
    </div>
  );
};

export default InventoryTable; 