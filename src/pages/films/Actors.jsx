import ActorsTable from '../../components/ActorsTable';

const Actors = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Actores</h3>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <ActorsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actors;