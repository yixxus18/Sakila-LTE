import { useMemo } from 'react';
import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import { postData, putData, deleteData } from '../utils/fetchData';
import sakilaConfig from '../configs/sakilaConfig';

const ActorsTable = () => {
  const { data: actors, isLoading, error, refetch } = useFetch(sakilaConfig.actors.getAll);

  const data = useMemo(() => {
    if (!actors) return [];
    return [...actors].sort((a, b) => a.actor_id - b.actor_id);
  }, [actors]);

  const handleCreate = async (newData) => {
    try {
      await postData(sakilaConfig.actors.create, newData);
      await refetch();
    } catch (error) {
      console.error('Error al crear actor:', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      await putData(sakilaConfig.actors.update(id), {
        first_name: updatedData.first_name.trim(),
        last_name: updatedData.last_name.trim()
      });
      await refetch();
    } catch (error) {
      console.error('Error al editar actor:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(sakilaConfig.actors.delete(id));
      await refetch();
    } catch (error) {
      console.error('Error al eliminar actor:', error);
    }
  };

  const columns = [
    { 
      header: 'ID',
      accessor: 'actor_id',
      noForm: true,
      searchable: false
    },
    { 
      header: 'Nombre',
      accessor: 'first_name',
      type: 'text',
      searchable: true,
      required: true
    },
    { 
      header: 'Apellido',
      accessor: 'last_name',
      type: 'text',
      searchable: true,
      required: true
    },
    { 
      header: 'Películas',
      accessor: 'films',
      render: (item) => (
        <div className="badge bg-secondary">
          {item.films?.length || 0} Películas
        </div>
      ),
      noForm: true
    },
    { 
      header: 'Última Actualización',
      accessor: 'last_update',
      render: (item) => (
        <span className="text-muted small">
          {new Date(item.last_update).toLocaleString()}
        </span>
      ),
      noForm: true
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      error={error}
      resource="Actor"
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      idKey="actor_id" // <- Agregar esta prop
    />
  );
};

export default ActorsTable;