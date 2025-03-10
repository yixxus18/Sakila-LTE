import StaffTable from "../../components/StaffTable";

const Staff = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Personal</h3>
        <div className="card-tools">
          <button type="button" className="btn btn-primary">
            Nuevo Personal
          </button>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <StaffTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff; 