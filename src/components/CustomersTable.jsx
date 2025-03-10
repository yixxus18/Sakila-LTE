import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import { postData, putData, deleteData } from '../utils/fetchData';
import sakilaConfig from '../configs/sakilaConfig';
import { useMemo } from 'react';

const CustomersTable = () => {
  const { data: customers, isLoading: customersLoading, error: customersError, refetch } = useFetch(sakilaConfig.customers.getAll);
  const { data: addresses, isLoading: addressesLoading, error: addressesError } = useFetch(sakilaConfig.addresses.getAll);

  const handleCreate = async (newData) => {
    try {
      if (!newData.address_id) {
        alert('Seleccione una dirección');
        return;
      }
      console.log(newData);
      await postData(sakilaConfig.customers.create, {
        first_name: newData.first_name,
        last_name: newData.last_name,
        email: newData.email,
        store_id: parseInt(newData.store_id),
        address_id: parseInt(newData.address_id),
        active: newData.active
      });
      refetch();
    } catch (error) {
      console.error('Error al crear cliente:', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      await putData(sakilaConfig.customers.update(id), {
        first_name: updatedData.first_name,
        last_name: updatedData.last_name,
        email: updatedData.email,
        store_id: parseInt(updatedData.store_id),
        address_id: parseInt(updatedData.address_id),
        active: updatedData.active
      });
      refetch();
    } catch (error) {
      console.error('Error al editar cliente:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(sakilaConfig.customers.delete(id));
      refetch();
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  };

  const columns = useMemo(() => [
    { 
      header: 'ID', 
      accessor: 'customer_id',
      noForm: true,
      searchable: false
    },
    { 
      header: 'Nombre',
      accessor: 'first_name',
      type: 'text',
      required: true,
      render: (item) => `${item.first_name} ${item.last_name}`
    },
    { 
      header: 'Apellido',
      accessor: 'last_name',
      type: 'text',
      required: true
    },
    { 
      header: 'Email', 
      accessor: 'email',
      type: 'email',
      required: true
    },
    { 
      header: 'Dirección',
      accessor: 'address_id',
      type: 'select',
      options: addresses || [],
      optionLabel: (address) => {
        const mainAddress = address.address || '';
        const city = address.city || '';
        const postal = address.postal_code ? ` (${address.postal_code})` : '';
        return `${mainAddress}${postal} - ${city}`;
      },
      optionValue: 'address_id',
      render: (item) => {
        const address = addresses?.find(a => a.address_id === item.address_id);
        return address ? `${address.address}${address.city ? ` - ${address.city}` : ''}` : 'N/A';
      }
    },
    { 
      header: 'Tienda',
      accessor: 'store_id',
      type: 'number',
      required: true
    },
    { 
      header: 'Activo',
      accessor: 'active',
      type: 'select',
      options: [
        { value: 1, label: 'Sí' },
        { value: 0, label: 'No' }
      ],
      optionLabel: (option) => option.label,
      optionValue: 'value',
      render: (item) => item.active ? 'Sí' : 'No'
    }
  ], [addresses]);

  return (
    <div className="card-body">
      <DataTable 
        columns={columns} 
        data={customers} 
        isLoading={customersLoading || addressesLoading}
        error={customersError || addressesError}
        resource="Cliente"
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        idKey="customer_id"
        allowDelete={false}
      />
    </div>
  );
};

export default CustomersTable;