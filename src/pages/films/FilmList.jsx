import FilmsTable from "../../components/FilmsTable";
const FilmList = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Lista de Películas</h3>
      </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <FilmsTable />
            </div>
          </div>
        </div>
    </div>
  );
};

export default FilmList; 