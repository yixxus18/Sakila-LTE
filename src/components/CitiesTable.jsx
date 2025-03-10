import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import sakilaConfig from '../configs/sakilaConfig';

const CitiesTable = () => {
  const { data, isLoading, error } = useFetch(sakilaConfig.cities.getAll);
  const countriesData = useFetch(sakilaConfig.countries.getAll);

  const columns = [
    { header: 'ID', accessor: 'city_id' },
    { 
      header: 'Ciudad',
      accessor: 'city',
      render: (item) => `${item.city}`
    },
    { 
      header: 'País',
      accessor: 'country_id',
      render: (item) => (
        countriesData.data?.find(c => c.country_id === item.country_id)?.country || 'N/A'
      )
    },
    { 
      header: 'Última Actualización', 
      accessor: 'last_update',
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
        title="Ciudades"
        allowCreate= {false}
        allowEdit = {false}
        allowDelete = {false}
      />
    </div>
  );
};

export default CitiesTable;