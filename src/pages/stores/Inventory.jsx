import InventoryTable from "../../components/InventoryTable";

const Inventory = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Inventario</h3>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <InventoryTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory; 