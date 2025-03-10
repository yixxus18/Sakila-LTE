import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import { postData } from '../utils/fetchData';
import sakilaConfig from '../configs/sakilaConfig';

const RentalsTable = () => {
  const { data: rentals, isLoading, error, refetch } = useFetch(sakilaConfig.rentals.getAll);
  const { data: customers } = useFetch(sakilaConfig.customers.getAll);
  const { data: staff } = useFetch(sakilaConfig.staff.getAll);
  const { data: inventory = [] } = useFetch(sakilaConfig.inventory.getAll);
  
  const handleCreate = async (newData) => {
    try {
      await postData(sakilaConfig.rentals.create, {
        ...newData,
        rental_date: new Date().toISOString(),
        inventory_id: parseInt(newData.inventory_id)
      });
      refetch();
    } catch (error) {
      console.error('Error al crear alquiler:', error);
    }
  };

  const columns = [
    { 
      header: 'ID', 
      accessor: 'rental_id',
      noForm: true,
      searchable: false
    },
    { 
      header: 'Cliente',
      accessor: 'customer_id',
      type: 'select',
      options: customers || [],
      optionLabel: (item) => `${item.first_name} ${item.last_name}`,
      optionValue: 'customer_id',
      render: (item) => (
        <div>
          {item.customer?.first_name} {item.customer?.last_name}
        </div>
      ),
      required: true
    },
    { 
      header: 'Staff',
      accessor: 'staff_id',
      type: 'select',
      options: staff || [],
      optionLabel: (item) => `${item.first_name} ${item.last_name}`,
      optionValue: 'staff_id',
      render: (item) => (
        <div>
          {item.staff?.first_name} {item.staff?.last_name}
        </div>
      ),
      required: true
    },
    { 
      header: 'Inventario',
      accessor: 'inventory_id',
      type: 'select',
      options: inventory,
      optionLabel: (item) => {
        // Corregir acceso a datos de inventario
        const filmTitle = item.film?.title || 'N/A';
        const storeId = item.store_id || 'N/A';
        return `${filmTitle} (Tienda ${storeId})`;
      },
      optionValue: 'inventory_id',
      required: true
    },
    { 
      header: 'Fecha Alquiler',
      accessor: 'rental_date',
      render: (item) => new Date(item.rental_date).toLocaleDateString(),
      noForm: true
    },
    { 
      header: 'Fecha Devolución',
      accessor: 'return_date',
      render: (item) => item.return_date ? new Date(item.return_date).toLocaleDateString() : 'Pendiente',
      noForm: true
    },
    { 
      header: 'Estado',
      render: (item) => {
        const isOverdue = new Date(item.rental_date) < new Date();
        return (
          <span className={`badge ${!item.return_date ? (isOverdue ? 'bg-danger' : 'bg-warning') : 'bg-success'}`}>
            {!item.return_date ? (isOverdue ? 'Vencido' : 'Activo') : 'Devuelto'}
          </span>
        );
      },
      noForm: true
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={rentals} 
      isLoading={isLoading} 
      error={error}
      resource="Alquiler"
      onCreate={handleCreate}
      allowEdit={false} // Deshabilitar edición según requerimientos
      allowDelete={false}
      idKey="rental_id"
    />
  );
};

export default RentalsTable;