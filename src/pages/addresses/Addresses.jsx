import AddressesTable from "../../components/AddressesTable";

const Addresses = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Direcciones</h3>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <AddressesTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addresses;
