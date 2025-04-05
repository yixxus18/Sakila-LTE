import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import { postData, putData, deleteData } from '../utils/fetchData';
import sakilaConfig from '../configs/sakilaConfig';
import { useMemo } from 'react';

const StaffTable = () => {
  const { data: staff, isLoading, error, refetch } = useFetch(sakilaConfig.staff.getAll);
  const { data: stores } = useFetch(sakilaConfig.stores.getAll);
  const { data: addresses } = useFetch(sakilaConfig.addresses.getAll);

  // Ordenar staff por ID
  const sortedStaff = useMemo(() => {
    if (!staff) return [];
    return [...staff].sort((a, b) => a.staff_id - b.staff_id);
  }, [staff]);

  const handleCreate = async (newData) => {
    try {
      // Asegurarse que todos los campos necesarios estén presentes
      const staffData = {
        first_name: newData.first_name,
        last_name: newData.last_name,
        address_id: parseInt(newData.address_id),
        email: newData.email,
        store_id: parseInt(newData.store_id),
        username: newData.username,
        password: newData.password,
        active: newData.active === '1'
      };

      // Agregar rol_id solo si se proporciona
      if (newData.rol_id) {
        staffData.rol_id = parseInt(newData.rol_id);
      }

      // Validación en el lado del cliente antes de enviar
      if (!staffData.first_name || staffData.first_name.length > 45) {
        throw new Error('El nombre debe tener entre 1 y 45 caracteres');
      }

      if (!staffData.last_name || staffData.last_name.length > 45) {
        throw new Error('El apellido debe tener entre 1 y 45 caracteres');
      }

      if (!staffData.username || staffData.username.length > 16) {
        throw new Error('El nombre de usuario debe tener entre 1 y 16 caracteres');
      }

      if (staffData.password && staffData.password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      console.log('Enviando datos de personal:', staffData);
      await postData(sakilaConfig.staff.create, staffData);
      refetch();
    } catch (error) {
      console.error('Error al crear personal:', error);
      throw error; // Re-lanzar para que el DataTable pueda mostrar el error
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      // Asegurarse que todos los campos necesarios estén presentes
      const staffData = {
        first_name: updatedData.first_name,
        last_name: updatedData.last_name,
        address_id: parseInt(updatedData.address_id),
        email: updatedData.email,
        store_id: parseInt(updatedData.store_id),
        username: updatedData.username,
        active: updatedData.active === '1'
      };

      // Incluir la contraseña solo si se proporciona
      if (updatedData.password) {
        staffData.password = updatedData.password;
      }

      // Incluir rol_id solo si se proporciona
      if (updatedData.rol_id) {
        staffData.rol_id = parseInt(updatedData.rol_id);
      }

      // Validación en el lado del cliente
      if (!staffData.first_name || staffData.first_name.length > 45) {
        throw new Error('El nombre debe tener entre 1 y 45 caracteres');
      }

      if (!staffData.last_name || staffData.last_name.length > 45) {
        throw new Error('El apellido debe tener entre 1 y 45 caracteres');
      }

      if (!staffData.username || staffData.username.length > 16) {
        throw new Error('El nombre de usuario debe tener entre 1 y 16 caracteres');
      }

      if (staffData.password && staffData.password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      console.log('Enviando datos actualizados de personal:', staffData);
      await putData(sakilaConfig.staff.update(id), staffData);
      refetch();
    } catch (error) {
      console.error('Error al actualizar personal:', error);
      throw error; // Re-lanzar para que el DataTable pueda mostrar el error
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteData(sakilaConfig.staff.delete(id));
      console.log('Eliminación exitosa:', result);
      refetch();
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar personal:', error);

      // Comprobar si el error es por intentar parsear una respuesta 204
      if (error.message && error.message.includes('JSON input')) {
        console.log('Respuesta 204 recibida pero se procesó correctamente');
        refetch(); // Actualizar la lista igualmente
        return { success: true };
      }

      // Lanzar el error para que el DataTable lo muestre
      throw new Error('Error al eliminar: ' + (error.message || 'Ocurrió un problema inesperado'));
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'staff_id',
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
      header: 'Password',
      accessor: 'password',
      type: 'password',
     render: () =>{
      <div>
        N/A
      </div>
     }

    },
    {
      header: 'Usuario',
      accessor: 'username',
      type: 'text',
      required: true,
      maxLength: 16 // Añadimos límite de caracteres según la validación
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
      required: true
    },
    {
      header: 'Tienda',
      accessor: 'store_id',
      type: 'select',
      options: stores || [],
      optionLabel: (store) => `Tienda #${store.store_id}`,
      optionValue: 'store_id',
      required: true,
      render: (item) => `Tienda #${item.store_id}`
    },
    {
      header: 'Activo',
      accessor: 'active',
      type: 'select',
      options: [
        { value: '1', label: 'Sí' },
        { value: '0', label: 'No' }
      ],
      optionLabel: 'label',
      optionValue: 'value',
      render: (item) => item.active ? 'Sí' : 'No'
    },
    {
      header: 'Última Actualización',
      accessor: 'last_update',
      render: (item) => new Date(item.last_update).toLocaleDateString(),
      noForm: true
    },
    {
      header: 'Rol',
      accessor: 'rol_id',
      type: 'select',
      required: false,
      options: [
        { value: '1', label: 'Administrador' },
        { value: '2', label: 'Cliente' },
        { value: '3', label: 'Invitado' }
      ],
      optionLabel: 'label',
      optionValue: 'value',
      render: (item) => {
        const roles = {
          1: 'Administrador',
          2: 'Cliente',
          3: 'Invitado'
        };
        return roles[item.rol_id] || 'No asignado';
      }
    },

  ];

  return (
    <div className="card-body">
      <DataTable
        columns={columns}
        data={sortedStaff}
        isLoading={isLoading}
        error={error}
        resource="Personal"
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        idKey="staff_id"
      />
    </div>
  );
};

export default StaffTable;
