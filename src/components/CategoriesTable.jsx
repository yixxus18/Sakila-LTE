import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import sakilaConfig from '../configs/sakilaConfig';

const CategoriesTable = () => {
  const { data, isLoading, error } = useFetch(sakilaConfig.categories.getAll);

  const columns = [
    { 
      header: 'ID', 
      accessor: 'category_id',
      searchable: false
    },
    { 
      header: 'Nombre',
      accessor: 'name'
    },
    { 
      header: 'Películas',
      accessor: 'films.length',
      render: (item) => (
        <span className="badge bg-secondary">
          {item.films?.length || 0}
        </span>
      )
    }
  ];

  return (
    <div className="card-body">
      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        error={error}
        resource="Categoría"
        readOnly={true}
        hideActions={true}
        allowCreate={false}
        allowEdit={false}
        allowDelete={false}
      />
    </div>
  );
};

export default CategoriesTable;