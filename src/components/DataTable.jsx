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

  // Función helper para valores anidados y formateo
  const getNestedValue = (obj, path) => {
    if (!path) return "";
    const value = path
      .split(".")
      .reduce((acc, part) => (acc && acc[part] ? acc[part] : ""), obj);
    
    // Si es una fecha, la formateamos
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
      return new Date(value).toLocaleDateString();
    }
    // Si es un número, lo convertimos a string
    if (typeof value === 'number') {
      return value.toString();
    }
    // Si es un booleano o estado, lo procesamos
    if (typeof value === 'boolean') {
      return value ? 'Activo' : 'Inactivo';
    }
    return value || "";
  };

  // Función para obtener el valor de búsqueda de una columna
  const getSearchValue = (item, col) => {
    if (col.render) {
      // Si tiene función render, la usamos para obtener el valor formateado
      const renderedValue = col.render(item);
      return typeof renderedValue === 'string' ? renderedValue : String(renderedValue || '');
    }
    return getNestedValue(item, col.accessor);
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

  // Datos filtrados con búsqueda mejorada
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((item) =>
      searchableColumns.some((accessor) => {
        const column = columns.find(col => col.accessor === accessor);
        if (!column) return false;
        
        const searchValue = getSearchValue(item, column);
        const stringValue = String(searchValue || "").toLowerCase();
        
        // Búsqueda por coincidencia parcial
        return stringValue.includes(lowerQuery);
      })
    );
  }, [data, searchQuery, searchableColumns, columns]);

  // Paginación mejorada
  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / pageSize),
    [filteredData.length]
  );

  const paginatedData = useMemo(
    () =>
      filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredData, currentPage]
  );

  // Función para cambiar página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Renderizado de controles de paginación
  const renderPagination = () => {
    const maxButtons = 5;
    const pageButtons = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Botón primera página
    if (startPage > 1) {
      pageButtons.push(
        <button
          key="first"
          className="btn btn-outline-primary btn-sm"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageButtons.push(<span key="ellipsis1">...</span>);
      }
    }

    // Botones de página
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`btn btn-${currentPage === i ? 'primary' : 'outline-primary'} btn-sm`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Botón última página
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(<span key="ellipsis2">...</span>);
      }
      pageButtons.push(
        <button
          key="last"
          className="btn btn-outline-primary btn-sm"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="d-flex gap-2 align-items-center">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        {totalPages > 10 && (
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={currentPage <= 10}
            onClick={() => handlePageChange(Math.max(1, currentPage - 10))}
          >
            -10
          </button>
        )}
        
        {pageButtons}
        
        {totalPages > 10 && (
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={currentPage > totalPages - 10}
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 10))}
          >
            +10
          </button>
        )}
        
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };

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
  const renderModal = () => {
    if (!showModal) return null;
    
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999
        }} 
        onClick={() => {
          setShowModal(false);
          setFormData({});
          setEditingId(null);
          setEditingItemIndex(null);
        }}
      >
        <div 
          style={{
            position: 'absolute',
            width: '800px',
            height: '600px',
            top: '50%',
            left: '50%',
            marginTop: '-300px',
            marginLeft: '-400px',
            backgroundColor: '#fff',
            boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
            zIndex: 10000
          }} 
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            style={{
              background: '#007bff',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 15px',
              borderBottom: '1px solid #0069d9'
            }}
          >
            <h5 style={{
              margin: 0,
              padding: 0,
              fontSize: '18px',
              fontWeight: 500,
              color: '#fff'
            }}>
              <i className={`fas ${editingId ? "fa-edit" : "fa-plus-circle"} me-2`}></i>
              {editingId ? "Editar" : "Crear"} {resource}
            </h5>
            <button 
              onClick={() => {
                setShowModal(false);
                setFormData({});
                setEditingId(null);
                setEditingItemIndex(null);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div 
            style={{
              padding: '20px',
              backgroundColor: '#f4f6f9',
              overflowY: 'auto',
              height: '523px'
            }}
          >
            <div style={{
              backgroundColor: '#fff',
              border: '1px solid #dee2e6',
              borderRadius: '0',
              boxShadow: 'none',
              padding: '15px'
            }}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  console.log('Formulario enviado');
                  try {
                    const formattedData = {};

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

                    console.log('Datos formateados:', formattedData);

                    let result;
                    if (editingId) {
                      console.log('Editando registro con ID:', editingId);
                      result = await onEdit(editingId, formattedData);
                      const itemPage =
                        Math.floor(editingItemIndex / pageSize) + 1;
                      setCurrentPage(itemPage);
                    } else {
                      console.log('Creando nuevo registro');
                      result = await onCreate(formattedData);
                      const lastPage = Math.ceil((data.length + 1) / pageSize);
                      setCurrentPage(lastPage);
                    }

                    console.log('Operación completada exitosamente:', result);
                    setShowModal(false);
                    setFormData({});
                    setEditingId(null);
                    setEditingItemIndex(null);
                  } catch (error) {
                    console.error("Error:", error);
                    // Mostrar mensaje más amigable con los detalles del error
                    const errorMessage = error.message || "Ocurrió un error inesperado";
                    const friendlyMessage = 
                      errorMessage.includes("NetworkError") ? "Error de conexión: Verifica tu conexión a internet" :
                      errorMessage.includes("Duplicate") ? "Ya existe un registro con esos datos" :
                      errorMessage.includes("required") ? "Por favor complete todos los campos requeridos" :
                      errorMessage;
                    
                    alert(`Error al procesar la operación: ${friendlyMessage}`);
                  }
                }}
              >
                <div className="row">
                  {columns
                    .filter((col) => !col.noForm)
                    .map((col) => (
                      <div className="col-md-6 mb-3" key={col.accessor}>
                        <div style={{
                          marginBottom: '12px'
                        }}>
                          <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontWeight: 500
                          }}>
                            {col.header}
                            {col.required && (
                              <span style={{color: 'red'}}>*</span>
                            )}
                          </label>

                          {col.type === "select" ? (
                          <select
                              value={formData[col.accessor] || ""}
                              onChange={(e) => {
                                if (col.onChange) {
                                  col.onChange(e.target.value, formData, setFormData);
                                } else {
                                  setFormData({
                                    ...formData,
                                    [col.accessor]: e.target.value,
                                  });
                                }
                              }}
                              required={typeof col.required === 'function' ? col.required(formData) : col.required}
                              disabled={col.disabled ? col.disabled(formData) : false}
                              style={{
                                width: '100%', 
                                padding: '8px 12px', 
                                border: '1px solid #ced4da', 
                                borderRadius: '4px',
                                fontSize: '14px',
                                lineHeight: '1.5'
                              }}
                          >
                            <option value="">Seleccionar...</option>
                              {(() => {
                                const options = typeof col.options === 'function' 
                                  ? col.options(formData) 
                                  : col.options || [];
                                
                                return options.map((option) => {
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
                                      key={`${col.accessor}-${value}`}
                                      value={value}
                                    >
                                      {label || "N/A"}
                                    </option>
                                  );
                                });
                              })()}
                          </select>
                          ) : col.type === "textarea" ? (
                          <textarea
                              rows="3"
                              value={formData[col.accessor] || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [col.accessor]: e.target.value,
                                })
                              }
                              required={typeof col.required === 'function' ? col.required(formData) : col.required}
                              style={{
                                width: '100%', 
                                padding: '8px 12px', 
                                border: '1px solid #ced4da', 
                                borderRadius: '4px',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                minHeight: '80px'
                              }}
                            />
                          ) : (
                          <input
                              type={col.type || "text"}
                              value={formData[col.accessor] || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [col.accessor]: e.target.value,
                                })
                              }
                              placeholder={`Ingrese ${col.header.toLowerCase()}`}
                              required={typeof col.required === 'function' ? col.required(formData) : col.required}
                              minLength={col.minLength}
                              maxLength={col.maxLength}
                              step={col.type === "number" ? "0.01" : undefined}
                              style={{
                                width: '100%', 
                                padding: '8px 12px', 
                                border: '1px solid #ced4da', 
                                borderRadius: '4px',
                                fontSize: '14px',
                                lineHeight: '1.5'
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                
                <div style={{
                  marginTop: '20px',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({});
                      setEditingId(null);
                      setEditingItemIndex(null);
                    }}
                    style={{
                      backgroundColor: '#6c757d',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      padding: '8px 16px',
                      marginRight: '10px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <i className="fas fa-times me-2"></i>Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#007bff',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
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
    );
  };

  return (
    <>
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
                Mostrando {paginatedData.length} de {filteredData.length} registros
              </div>
              {renderPagination()}
            </div>
          )}
        </div>
      </div>
      {showModal && renderModal()}
    </>
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
      required: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
      minLength: PropTypes.number,
      maxLength: PropTypes.number,
      options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
      optionLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      optionValue: PropTypes.string,
      onChange: PropTypes.func,
      disabled: PropTypes.func
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
