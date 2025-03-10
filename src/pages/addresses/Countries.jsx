import CountriesTable from "../../components/CountriesTable";

const Countries = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Paises</h3>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <CountriesTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countries;
