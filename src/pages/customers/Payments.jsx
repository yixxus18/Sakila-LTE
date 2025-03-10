import PaymentsTable from "../../components/PaymentsTable";

const Payments = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Pagos</h3>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <PaymentsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
