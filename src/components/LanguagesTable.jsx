import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import { postData } from '../utils/fetchData'; // Importar postData
import sakilaConfig from '../configs/sakilaConfig';
import { useMemo } from 'react';

const LanguagesTable = () => {
  const { data, isLoading, error, refetch } = useFetch(`${sakilaConfig.baseURL}/languages`);

  const handleCreate = async (newData) => {
    try {
      await postData(`${sakilaConfig.baseURL}/languages`, {
        name: newData.name
      });
      refetch();
    } catch (error) {
      console.error('Error al crear idioma:', error);
    }
  };

  const columns = useMemo(() => [
    { 
      header: 'ID', 
      accessor: 'language_id',
      noForm: true,
      searchable: false
    },
    { 
      header: 'Nombre', 
      accessor: 'name',
      type: 'text',
      required: true
    },
    { 
      header: 'Películas',
      accessor: 'films',
      render: (item) => item.films?.length ?? 0,
      noForm: true
    }
  ], []);

  return (
    <div className="card-body">
      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        error={error}
        resource="Idioma"
        onCreate={handleCreate}
        allowCreate={true}
        allowEdit={false}
        allowDelete={false}
        readOnly={false}
      />
    </div>
  );
};

export default LanguagesTable;