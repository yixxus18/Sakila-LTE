import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import sakilaConfig from '../configs/sakilaConfig';
import { useMemo } from 'react';

const StoresTable = () => {
  const { data: stores, isLoading, error } = useFetch(sakilaConfig.stores.getAll);
  // Para cuando se necesite crear tiendas
  // const { data: addresses } = useFetch(sakilaConfig.addresses.getAll);
  // const { data: staff } = useFetch(sakilaConfig.staff.getAll);

  // Ordenar tiendas por ID
  const sortedStores = useMemo(() => {
    if (!stores) return [];
    return [...stores].sort((a, b) => a.store_id - b.store_id);
  }, [stores]);

  // Código para crear tiendas (comentado para uso futuro)
  /*
  const handleCreate = async (newData) => {
    try {
      await postData(sakilaConfig.stores.create, {
        manager_staff_id: parseInt(newData.manager_staff_id),
        address_id: parseInt(newData.address_id)
      });
      refetch();
    } catch (error) {
      console.error('Error al crear tienda:', error);
    }
  };

  const columns = [
    { 
      header: 'ID', 
      accessor: 'store_id',
      noForm: true,
      searchable: false
    },
    { 
      header: 'Dirección',
      accessor: 'address_id',
      type: 'select',
      options: addresses || [],
      optionLabel: (address) => {
        const mainAddress = address.address || '';
        const city = address.city || '';
        return `${mainAddress} - ${city}`;
      },
      optionValue: 'address_id',
      required: true,
      render: (item) => item.address || 'N/A'
    },
    { 
      header: 'Gerente',
      accessor: 'manager_staff_id',
      type: 'select',
      options: staff || [],
      optionLabel: (item) => `${item.first_name} ${item.last_name}`,
      optionValue: 'staff_id',
      required: true,
      render: (item) => item.manager ? `${item.manager.first_name} ${item.manager.last_name}` : 'N/A'
    },
    { 
      header: 'Última Actualización', 
      accessor: 'last_update',
      render: (item) => new Date(item.last_update).toLocaleDateString(),
      noForm: true
    }
  ];
  */

  // Columnas solo para visualización
  const columns = [
    { 
      header: 'ID', 
      accessor: 'store_id',
      searchable: false
    },
    { 
      header: 'Dirección',
      accessor: 'address',
      render: (item) => item.address || 'N/A'
    },
    { 
      header: 'Gerente',
      render: (item) => item.manager ? `${item.manager.first_name} ${item.manager.last_name}` : 'N/A'
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
        data={sortedStores} 
        isLoading={isLoading} 
        error={error}
        resource="Tienda"
        allowCreate={false}
        // onCreate={handleCreate}
        allowEdit={false}
        allowDelete={false}
        idKey="store_id"
      />
    </div>
  );
};

export default StoresTable; 