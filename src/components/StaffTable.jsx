import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import sakilaConfig from '../configs/sakilaConfig';

const StaffTable = () => {
  const { data, isLoading, error } = useFetch(sakilaConfig.staff.getAll);

  const columns = [
    { header: 'ID', accessor: 'staff_id' },
    { 
      header: 'Nombre',
      render: (item) => `${item.first_name} ${item.last_name}`
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Usuario', accessor: 'username' },
    { 
      header: 'Activo',
      accessor: 'active',
      render: (item) => item.active ? 'Sí' : 'No'
    },
    { 
      header: 'Tienda',
      accessor: 'store_id',
      render: (item) => `Tienda #${item.store_id}`
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

export default StaffTable; 