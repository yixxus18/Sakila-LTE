import StoresTable from "../../components/StoresTable";

const StoreList = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Lista de Tiendas</h3>
        <div className="card-tools">
          <button type="button" className="btn btn-primary">
            Nueva Tienda
          </button>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <StoresTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreList; 