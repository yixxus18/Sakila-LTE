import CitiesTable from "../../components/CitiesTable";

const Cities = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Ciudades</h3>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <CitiesTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cities;
