import LanguagesTable from "../../components/LanguagesTable";

const Languages = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Idiomas</h3>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <LanguagesTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Languages; 