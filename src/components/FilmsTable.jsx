import DataTable from './DataTable';
import useFetch from '../hooks/useFetch';
import { postData, putData } from '../utils/fetchData';
import sakilaConfig from '../configs/sakilaConfig';
import { useMemo } from 'react';

const FilmsTable = () => {
  const { data: films, isLoading, error, refetch } = useFetch(sakilaConfig.films.getAll);
  const { data: languages } = useFetch(sakilaConfig.languages.getAll); 

  const handleCreate = async (newData) => {
    try {
      console.log('Enviando datos de nueva película:', newData); 
      await postData(sakilaConfig.films.create, {
        ...newData,
        language_id: parseInt(newData.language_id),
        release_year: parseInt(newData.release_year),
        length: parseInt(newData.length),
        rental_rate: parseFloat(newData.rental_rate)
      });
      refetch();
    } catch (error) {
      console.error('Error al crear película:', error);
    }
  };


  const handleEdit = async (id, updatedFilm) => {
    try {
      console.log('Actualizando película ID:', id, 'Datos:', updatedFilm); 
      await putData(sakilaConfig.films.update(id), {
        title: updatedFilm.title,
        description: updatedFilm.description,
        release_year: parseInt(updatedFilm.release_year),
        length: parseInt(updatedFilm.length),
        language_id: parseInt(updatedFilm.language_id),
        rental_rate: parseFloat(updatedFilm.rental_rate),
        rating: updatedFilm.rating
      });
      await refetch();
    } catch (error) {
      console.error('Error al editar película:', error);
    }
  };

  const formattedFilms = useMemo(() => {
    return films?.map(film => ({
      ...film,
      language: languages?.find(lang => lang.language_id === film.language_id)
    })) || [];
  }, [films, languages]);

  const columns = [
    { 
      header: 'ID', 
      accessor: 'film_id',
      noForm: true,
      searchable: false
    },
    { 
      header: 'Título',
      accessor: 'title',
      type: 'text',
      required: true
    },
    { 
      header: 'Descripción',
      accessor: 'description',
      type: 'textarea',
      required: false
    },
    { 
      header: 'Año',
      accessor: 'release_year',
      type: 'number',
      required: true
    },
    { 
      header: 'Duración',
      accessor: 'length',
      type: 'number',
      required: false
    },
    { 
      header: 'Idioma',
      accessor: 'language_id',
      type: 'select',
      options: languages || [],
      optionLabel: 'name',
      optionValue: 'language_id',
      render: (item) => item.language?.name || 'N/A'
    },
    { 
      header: 'Clasificación',
      accessor: 'rating',
      type: 'select',
      options: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
      required: true
    },
    { 
      header: 'Precio de Renta',
      accessor: 'rental_rate',
      type: 'number',
      render: (item) => `$${item.rental_rate}`
    },
    { 
      header: 'Categorías',
      accessor: 'categories',
      render: (item) => (
        <div className="badge bg-secondary">
          {item.categories.map(cat => cat.name).join(', ') || 'N/A'}
        </div>
      ),
      noForm: true
    }
  ];

  return (
    <div className="card-body">
      <DataTable 
        columns={columns} 
        data={formattedFilms} 
        isLoading={isLoading} 
        error={error}
        resource="Película"
        onCreate={handleCreate}
        onEdit={handleEdit}
        allowDelete={false}
        idKey="film_id"
      />
    </div>
  );
};

export default FilmsTable;