import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import { postData } from '../utils/fetchData';
import sakilaConfig from '../configs/sakilaConfig';
import { useMemo } from 'react';

const PaymentsTable = () => {
  const { data: payments, isLoading, error, refetch } = useFetch(sakilaConfig.payments.getAll);
  const { data: customers } = useFetch(sakilaConfig.customers.getAll);
  const { data: staff } = useFetch(sakilaConfig.staff.getAll);
  const { data: rentals } = useFetch(sakilaConfig.rentals.getAll);

  // Ordenar pagos por ID
  const sortedPayments = useMemo(() => {
    if (!payments) return [];
    return [...payments].sort((a, b) => a.payment_id - b.payment_id);
  }, [payments]);

  const handleCreate = async (newData) => {
    try {
      if (!newData.rental_id) {
        alert('Debe seleccionar un alquiler');
        return;
      }
      console.log(newData);
      await postData(sakilaConfig.payments.create, {
        customer_id: parseInt(newData.customer_id),
        staff_id: parseInt(newData.staff_id),
        rental_id: parseInt(newData.rental_id),
        amount: parseFloat(newData.amount),
        payment_date: new Date().toISOString()
      });
      refetch();
    } catch (error) {
      console.error('Error al crear pago:', error);
    }
  };

  const columns = [
    { 
      header: 'ID', 
      accessor: 'payment_id',
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
      render: (item) => item.customer || 'N/A',
      required: true,
      onChange: (value, formData, setFormData) => {
        // Al cambiar el cliente, resetear el alquiler seleccionado
        setFormData({ ...formData, customer_id: value, rental_id: '' });
      }
    },
    { 
      header: 'Alquiler',
      accessor: 'rental_id',
      type: 'select',
      options: (formData) => {
        // Filtrar alquileres por cliente seleccionado y que no estén devueltos
        return rentals?.filter(rental => 
          !rental.return_date && 
          rental.customer_id === parseInt(formData.customer_id)
        ) || [];
      },
      optionLabel: (item) => {
        const film = item.film || {};
        return `ID: ${item.rental_id} - Película: ${film.title || 'N/A'}`;
      },
      optionValue: 'rental_id',
      required: true,
      disabled: (formData) => !formData.customer_id
    },
    { 
      header: 'Monto',
      accessor: 'amount',
      type: 'number',
      required: true,
      render: (item) => `$${Number(item.amount).toFixed(2)}`
    },
    { 
      header: 'Fecha de Pago',
      accessor: 'payment_date',
      render: (item) => new Date(item.payment_date).toLocaleDateString(),
      noForm: true
    },
    { 
      header: 'Personal',
      accessor: 'staff_id',
      type: 'select',
      options: staff || [],
      optionLabel: (item) => `${item.first_name} ${item.last_name}`,
      optionValue: 'staff_id',
      render: (item) => item.staff || 'N/A',
      required: true
    }
  ];

  return (
    <div className="card-body">
      <DataTable 
        columns={columns} 
        data={sortedPayments} 
        isLoading={isLoading} 
        error={error}
        resource="Pago"
        onCreate={handleCreate}
        allowDelete={false}
        allowEdit={false}
        idKey="payment_id"
      />
    </div>
  );
};

export default PaymentsTable; 