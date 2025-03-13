import StoresTable from "../../components/StoresTable";

const StoreList = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Lista de Tiendas</h3>
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