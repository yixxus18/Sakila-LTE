import { useState, useMemo } from "react";
import PropTypes from "prop-types";

const DataTable = ({
  columns,
  data,
  isLoading,
  error,
  onCreate,
  onEdit,
  onDelete,
  resource,
  allowCreate = true,
  allowEdit = true,
  allowDelete = true,
  idKey = "id",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const pageSize = 10;

  // Función helper para valores anidados
  const getNestedValue = (obj, path) => {
    if (!path) return "";
    return path
      .split(".")
      .reduce((acc, part) => (acc && acc[part] ? acc[part] : ""), obj);
  };

  // Columnas buscables
  const searchableColumns = useMemo(
    () =>
      columns
        .filter((col) => col.searchable !== false)
        .map((col) => col.accessor)
        .filter(Boolean),
    [columns]
  );

  // Datos filtrados
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((item) =>
      searchableColumns.some((accessor) => {
        const value = getNestedValue(item, accessor);
        return String(value || "")
          .toLowerCase()
          .includes(lowerQuery);
      })
    );
  }, [data, searchQuery, searchableColumns]);

  // Paginación
  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / pageSize),
    [filteredData.length]
  );

  const paginatedData = useMemo(
    () =>
      filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage]
  );

  // Renderizado de acciones
  const renderActions = (item, index) => (
    <div className="d-flex gap-2">
      {allowEdit && (
        <button
          className="btn btn-warning btn-sm"
          onClick={() => {
            const initialFormData = columns.reduce((acc, col) => {
              if (!col.noForm) {
                // Obtener el valor usando el accessor (soporta nested objects)
                const value = getNestedValue(item, col.accessor);

                // Convertir a string para inputs numéricos/select
                acc[col.accessor] = value?.toString() || "";
              }
              return acc;
            }, {});

            setEditingId(item[idKey]);
            setEditingItemIndex(index);
            setFormData(initialFormData);
            setShowModal(true);
          }}
        >
          <i className="fas fa-edit me-1"></i>Editar
        </button>
      )}
      {allowDelete && (
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(item[idKey])}
        >
          <i className="fas fa-trash me-1"></i>Eliminar
        </button>
      )}
    </div>
  );

  // Renderizado del modal
  const renderModal = () => (
    <div className="modal-wrapper">
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i
                  className={`fas ${
                    editingId ? "fa-edit" : "fa-plus-circle"
                  } me-2`}
                ></i>
                {editingId ? "Editar" : "Crear"} {resource}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowModal(false);
                  setFormData({});
                  setEditingId(null);
                  setEditingItemIndex(null);
                }}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const formattedData = {};

                    // Convertir tipos de datos
                    columns
                      .filter((col) => !col.noForm)
                      .forEach((col) => {
                        const value = formData[col.accessor];
                        if (col.type === "number") {
                          formattedData[col.accessor] = value
                            ? parseFloat(value)
                            : null;
                        } else if (col.type === "select" && col.optionValue) {
                          formattedData[col.accessor] = value
                            ? parseInt(value)
                            : null;
                        } else {
                          formattedData[col.accessor] = value;
                        }
                      });

                    if (editingId) {
                      await onEdit(editingId, formattedData);
                      const itemPage =
                        Math.floor(editingItemIndex / pageSize) + 1;
                      setCurrentPage(itemPage);
                    } else {
                      await onCreate(formattedData);
                      const lastPage = Math.ceil((data.length + 1) / pageSize);
                      setCurrentPage(lastPage);
                    }

                    setShowModal(false);
                    setFormData({});
                    setEditingId(null);
                    setEditingItemIndex(null);
                  } catch (error) {
                    console.error("Error:", error);
                  }
                }}
              >
                <div className="row">
                  {columns
                    .filter((col) => !col.noForm)
                    .map((col) => (
                      <div className="col-md-6 mb-3" key={col.accessor}>
                        <div className="form-group">
                          <label className="form-label fw-bold">
                            {col.header}
                            {col.required && (
                              <span className="text-danger">*</span>
                            )}
                          </label>

                          {col.type === "select" ? (
                            <select
                              className="form-select"
                              value={formData[col.accessor] || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [col.accessor]: e.target.value,
                                })
                              }
                              required={col.required}
                            >
                              <option value="">Seleccionar...</option>
                              {col.options?.map((option, index) => {
                                const label = col.optionLabel
                                  ? typeof col.optionLabel === "function"
                                    ? col.optionLabel(option)
                                    : option[col.optionLabel]
                                  : option;
                                const value = col.optionValue
                                  ? option[col.optionValue]
                                  : option;

                                return (
                                  <option
                                    key={`${col.accessor}-${index}`} // ← Clave única
                                    value={value}
                                  >
                                    {label || "N/A"}
                                  </option>
                                );
                              })}
                            </select>
                          ) : col.type === "textarea" ? (
                            <textarea
                              className="form-control"
                              rows="3"
                              value={formData[col.accessor] || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [col.accessor]: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <input
                              type={col.type || "text"}
                              className="form-control"
                              value={formData[col.accessor] || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [col.accessor]: e.target.value,
                                })
                              }
                              placeholder={`Ingrese ${col.header.toLowerCase()}`}
                              required={col.required}
                              step={col.type === "number" ? "0.01" : undefined}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({});
                      setEditingId(null);
                      setEditingItemIndex(null);
                    }}
                  >
                    <i className="fas fa-times me-2"></i>Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i
                      className={`fas ${
                        editingId ? "fa-save" : "fa-check"
                      } me-2`}
                    ></i>
                    {editingId ? "Guardar cambios" : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => {
            setShowModal(false);
            setFormData({});
            setEditingId(null);
            setEditingItemIndex(null);
          }}
        />
      )}
    </div>
  );

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3 align-items-center">
          <div className="d-flex gap-2">
            {allowCreate && (
              <button
                className="btn btn-success btn-sm"
                onClick={() => {
                  setEditingId(null);
                  setFormData({});
                  setShowModal(true);
                }}
              >
                <i className="fas fa-plus me-2"></i>
                Crear {resource}
              </button>
            )}
          </div>
          <div style={{ width: "300px" }}>
            {searchableColumns.length > 0 && (
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="thead-dark">
              <tr>
                {columns.map((col) => (
                  <th key={col.accessor} className="align-middle">
                    {col.header}
                  </th>
                ))}
                {(allowEdit || allowDelete) && (
                  <th className="align-middle">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center">
                    <div className="alert alert-danger m-0">{error}</div>
                  </td>
                </tr>
              )}
              {!isLoading && !error && paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center">
                    {data.length === 0 ? (
                      <div className="alert alert-info m-0">
                        No hay datos disponibles
                      </div>
                    ) : (
                      <div className="alert alert-warning m-0">
                        No se encontraron resultados
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={index}>
                    {columns.map((col) => (
                      <td key={col.accessor}>
                        {col.render
                          ? col.render(item)
                          : getNestedValue(item, col.accessor)}
                      </td>
                    ))}
                    {(allowEdit || allowDelete) && (
                      <td>{renderActions(item, index)}</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Mostrando {paginatedData.length} de {filteredData.length}{" "}
              registros
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <i className="fas fa-chevron-left me-2"></i>Anterior
              </button>
              <span className="px-3">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Siguiente<i className="fas fa-chevron-right ms-2"></i>
              </button>
            </div>
          </div>
        )}

        {showModal && renderModal()}
      </div>
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      render: PropTypes.func,
      searchable: PropTypes.bool,
      noForm: PropTypes.bool,
      type: PropTypes.string,
      required: PropTypes.bool,
    })
  ).isRequired,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onCreate: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  resource: PropTypes.string.isRequired,
  allowCreate: PropTypes.bool,
  allowEdit: PropTypes.bool,
  allowDelete: PropTypes.bool,
  idKey: PropTypes.string,
};

DataTable.defaultProps = {
  data: [],
  isLoading: false,
  error: null,
  allowCreate: true,
  allowEdit: true,
  allowDelete: true,
  idKey: "id",
};

export default DataTable;
