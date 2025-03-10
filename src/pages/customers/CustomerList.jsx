import CustomersTable from "../../components/CustomersTable";

const CustomerList = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Lista de Clientes</h3>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <CustomersTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
