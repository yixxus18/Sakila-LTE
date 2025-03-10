import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import sakilaConfig from '../configs/sakilaConfig';

const CountriesTable = () => {
  const { data, isLoading, error } = useFetch(sakilaConfig.countries.getAll);

  const columns = [
    { 
      header: 'ID', 
      accessor: 'country_id',
      searchable: false
    },
    { 
      header: 'País',
      accessor: 'country',
      searchable: true,
      render: (item) => item.country
    },
    { 
      header: 'Última Actualización', 
      accessor: 'last_update',
      searchable: false,
      render: (item) => new Date(item.last_update).toLocaleString()
    }
  ];

  return (
    <div className="card-body">
      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        error={error}
        title="Países"
        allowCreate={false}
        allowEdit={false}
        allowDelete={false}
      />
    </div>
  );
};

export default CountriesTable;