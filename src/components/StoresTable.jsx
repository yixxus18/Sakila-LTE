import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import sakilaConfig from '../configs/sakilaConfig';

const StoresTable = () => {
  const { data, isLoading, error } = useFetch(sakilaConfig.stores.getAll);

  const columns = [
    { header: 'ID', accessor: 'store_id' },
    { header: 'Dirección', accessor: 'address' },
    { 
      header: 'Gerente',
      render: (item) => `${item.manager.first_name} ${item.manager.last_name}`
    },
    { 
      header: 'Última Actualización', 
      accessor: 'last_update',
      render: (item) => new Date(item.last_update).toLocaleDateString()
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

export default StoresTable; 