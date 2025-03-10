import CategoriesTable from "../../components/CategoriesTable";

const Categories = () => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Categorías</h3>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <CategoriesTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories; 