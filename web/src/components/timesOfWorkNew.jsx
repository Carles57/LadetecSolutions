import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendar, faTimes, faUserClock, faArrowLeft, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { parseISO } from 'date-fns'; 

const API_URL = 'http://localhost:3000';

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onClick={onClick}
      ref={ref}
      readOnly
      className="w-full p-2 pr-8 border border-gray-300 rounded-lg shadow-sm"
    />
    <FontAwesomeIcon
      icon={faCalendar}
      className="absolute right-3 top-3 text-gray-400 pointer-events-none"
    />
  </div>
));

const formatLocalDate = (date) => {
  return format(date, 'yyyy-MM-dd');
};

const formatMonthLocalDate = (date) => {
  if (!date) return 
  return format(date, 'yyyy-MM');
};

const EmployeeDetails = ({ employee, onClose }) => {
    const [timeDetails, setTimeDetails] = useState([]);
    const [filteredDetails, setFilteredDetails] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [filter, setFilter] = useState('');
    const [currentDetailsPage, setCurrentDetailsPage] = useState(1);
    const [detailsPerPage, setDetailsPerPage] = useState(5);
  
    useEffect(() => {
      const fetchDetails = async () => {
        try {
          const response = await fetch(
            `${API_URL}/links/analytic_time_time/${employee.employee_id}/${formatLocalDate(employee.date)}`
          );
          
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const result = await response.json();
          const extractedData = Array.isArray(result) ? result : 
                             Array.isArray(result?.data) ? result.data : [];
          
          setTimeDetails(extractedData);
          setFilteredDetails(extractedData);
          
        } catch (error) {
          console.error('Error fetching details:', error);
          setTimeDetails([]);
          setFilteredDetails([]);
        } finally {
          setLoadingDetails(false);
        }
      };
    
      if (employee) {
        fetchDetails();
        setCurrentDetailsPage(1);
        setFilter('');
      }
    }, [employee]);
  
    useEffect(() => {
      if (filter) {
        const filtered = timeDetails.filter(detail =>
          (detail.name?.toLowerCase().includes(filter.toLowerCase()) || '') ||
          (detail.proyecto?.toLowerCase().includes(filter.toLowerCase()) || '')
        );
        setFilteredDetails(filtered);
      } else {
        setFilteredDetails(timeDetails);
      }
      setCurrentDetailsPage(1);
    }, [filter, timeDetails]);
    
    // Cálculos de paginación
    const detailsLastIndex = currentDetailsPage * detailsPerPage;
    const detailsFirstIndex = detailsLastIndex - detailsPerPage;
    const currentDetails = filteredDetails.slice(detailsFirstIndex, detailsLastIndex);
    const detailsTotalPages = Math.ceil(filteredDetails.length / detailsPerPage);
    const totalHoras = filteredDetails.reduce((sum, detail) => sum + (detail.horas || 0), 0);

  const paginateDetails = (pageNumber) => setCurrentDetailsPage(pageNumber);

  const handleDetailsPerPageChange = (e) => {
    setDetailsPerPage(Number(e.target.value));
    setCurrentDetailsPage(1);
  };

  const renderDetailsPagination = () => {
    if (detailsTotalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (detailsTotalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = detailsTotalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
      
      if (currentDetailsPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentDetailsPage + maxPagesAfterCurrent >= detailsTotalPages) {
        startPage = detailsTotalPages - maxVisiblePages + 1;
        endPage = detailsTotalPages;
      } else {
        startPage = currentDetailsPage - maxPagesBeforeCurrent;
        endPage = currentDetailsPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    const totalHoras = timeDetails.reduce((sum, detail) => sum + (detail.horas || 0), 0);
    return (
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Mostrando  {detailsFirstIndex + 1}-{Math.min(detailsLastIndex, filteredDetails.length)} de {filteredDetails.length} registros
          </span>
          
          <select
            value={detailsPerPage}
            onChange={handleDetailsPerPageChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50, 100].map(size => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => paginateDetails(1)}
            disabled={currentDetailsPage === 1}
            className={`px-3 py-1 rounded-md ${currentDetailsPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            «
          </button>
          
          <button
            onClick={() => paginateDetails(currentDetailsPage - 1)}
            disabled={currentDetailsPage === 1}
            className={`px-3 py-1 rounded-md ${currentDetailsPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            ‹
          </button>

          {startPage > 1 && (
            <button
              onClick={() => paginateDetails(1)}
              className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              1
            </button>
          )}
          
          {startPage > 2 && <span className="px-2 py-1">...</span>}

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginateDetails(number)}
              className={`px-3 py-1 rounded-md ${currentDetailsPage === number ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            >
              {number}
            </button>
          ))}

          {endPage < detailsTotalPages - 1 && <span className="px-2 py-1">...</span>}
          
          {endPage < detailsTotalPages && (
            <button
              onClick={() => paginateDetails(detailsTotalPages)}
              className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              {detailsTotalPages}
            </button>
          )}

          <button
            onClick={() => paginateDetails(currentDetailsPage + 1)}
            disabled={currentDetailsPage === detailsTotalPages}
            className={`px-3 py-1 rounded-md ${currentDetailsPage === detailsTotalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            ›
          </button>
          
          <button
            onClick={() => paginateDetails(detailsTotalPages)}
            disabled={currentDetailsPage === detailsTotalPages}
            className={`px-3 py-1 rounded-md ${currentDetailsPage === detailsTotalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            »
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Detalles de Tiempo en el Mes: {employee?.name} - {format(employee?.date, 'MM/yyyy')}
        </h2>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
            <path fill-rule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      {loadingDetails ? (
        <div className="text-center py-4">
          <div className="animate-spin inline-block text-blue-600">🔄</div>
          <p className="mt-2 text-gray-600">Cargando detalles...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
             <div className="mb-4">
                <input
                    type="text"
                    placeholder="Filtrar por tarea o proyecto..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
             </div>
          <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 font-bold">Fecha</th>
                <th className="border border-gray-300 p-2 font-bold">Tarea</th>
                <th className="border border-gray-300 p-2 font-bold">Proyecto</th>
                <th className="border border-gray-300 p-2 font-bold">Tiempo (horas)</th>
                <th className="border border-gray-300 p-2 font-bold">Tasa</th>
              </tr>
            </thead>
            <tbody>
              {currentDetails.length > 0 ? (
                <>
                {/* Mapeo existente (sin cambios) */}
                {currentDetails.map((detail, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">{detail.date}</td>
                    <td className="border border-gray-300 p-2">{detail.name}</td>
                    <td className="border border-gray-300 p-2">{detail.proyecto}</td>
                    <td className="border border-gray-300 p-2 font-semibold text-blue-600">
                      {detail.horas.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2">{detail.tasa}</td>
                  </tr>
                ))}
                
                {/* Fila del total*/}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan="3" className="border border-gray-300 p-2 text-right">
                    Total:
                  </td>
                  <td className="border border-gray-300 p-2 font-semibold text-blue-600">
                    {totalHoras.toFixed(2)} hrs
                  </td>
                  <td className="border border-gray-300 p-2"></td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  {/* Mensaje mejorado (NUEVO) */}
                  {filter ? 'No hay resultados para este filtro' : 'No se encontraron registros para esta fecha'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {renderDetailsPagination()}
      </div>
    )}
    </div>
  );
};

export default function HoursReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [hasFatalError, setHasFatalError] = useState(false);
  //const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return formatLocalDate(today); // Esto devuelve 'YYYY-MM-DD'
  });

  if (hasFatalError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <p>Error crítico. <button onClick={() => window.location.reload()}>Reintentar</button></p>
      </div>
    );
  }

  // Calcular datos paginados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Selector de items por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
      
      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length} registros
          </span>
          
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50, 100].map(size => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            «
          </button>
          
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            ‹
          </button>

          {startPage > 1 && (
            <button
              onClick={() => paginate(1)}
              className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              1
            </button>
          )}
          
          {startPage > 2 && <span className="px-2 py-1">...</span>}

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages - 1 && <span className="px-2 py-1">...</span>}
          
          {endPage < totalPages && (
            <button
              onClick={() => paginate(totalPages)}
              className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              {totalPages}
            </button>
          )}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            ›
          </button>
          
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            »
          </button>
        </div>
      </div>
    );
  };

  const formatDateToLocal = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date - offset);
    return localDate.toISOString().split('T')[0];
  };

  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const fetchData = async (date) => {
    console.log('selectedDate:', selectedDate);
    const dateString = formatMonthLocalDate(date);
    console.log("Fecha ahora: " + dateString);
    try {
      const response = await fetch(`${API_URL}/links/employee_hours/${dateString}`);

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      
      const result = await response.json();
      console.log(result);
      const processedData = result.map(item => ({
        id: item.id,
        tasa: item.tasa,
        employee_id: item.employee_id,
        name: item.name,
        date: item.date,
        horas: Number(item.horas) || 0
      }));
      
      setData(processedData);
      setFilteredData(processedData);
      setError(null);
    } catch (error) {
      setError(error.message);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Solo se ejecuta al montar el componente
    const today = new Date();
    fetchData(today); // Enviamos el objeto Date directamente
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    const filtered = data.filter(item => 
      item.name.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleDateChange = (e) => {
    const dateString = e.target.value; // Formato YYYY-MM-DD
    setSelectedDate(dateString);
    setCurrentPage(1);
    // Convertimos a Date para fetchData
    fetchData(parseISO(dateString));
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Espere unos segundos...
        <div className="animate-spin inline-block mt-2">🔄</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg mx-4">
        Error: {error}
        <button
          onClick={() => fetchData(selectedDate)}
          className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Tareas y Tiempos del Mes Seleccionado
          </span>
          <FontAwesomeIcon 
            icon={faClock} 
            className="ml-3 text-blue-600 align-middle"
          />
        </h1>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        <label htmlFor="date-select" className="text-sm font-medium text-gray-700">
          Filtrar por fecha:
        </label>
        <input
          type="date"
          id="date-select"
          value={selectedDate}
          onChange={handleDateChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
       
      <input
        type="text"
        placeholder="Filtrar por nombre..."
        value={filter}
        onChange={handleFilterChange}
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
      />

      {/* Tabla */}
      <div className="bg-white mt-2 rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gradient-to-r from-blue-600 to-cyan-500">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Horas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Detalles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Add Metodos
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((item, index) => (
              <tr 
                key={`${item.id}-${item.date}`} 
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-6 py-4 text-sm text-gray-900 align-middle">
                  {item.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium align-middle">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 align-middle">
                  {parseLocalDate(item.date).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-blue-600 align-middle">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100">
                      {item.horas.toFixed(2)} hrs
                    </span>
                    {item.horas >= 8 && (
                      <span className="ml-2 text-green-500">✓</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-center align-middle">
                  <button
                    onClick={() => setSelectedEmployee({
                      employee_id: item.employee_id,
                      name: item.name,
                      date: parseISO(selectedDate),
                      tasa: item.tasa
                    })}
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faUserClock} className="mr-2" />
                    <span>Detalles</span>
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-center align-middle">
                  <button
                    onClick={() => {
                      const queryParams = new URLSearchParams({
                        employeeId: item.employee_id,
                        tasa: item.tasa,
                        name: encodeURIComponent(item.name),
                        selectedDate: formatLocalDate(selectedDate),  
                        totalHours: item.horas.toFixed(2)
                      }).toString();
                      
                      window.location.href = `/SelectMethod?${queryParams}`;
                    }}
                    className="text-green-600 hover:text-green-800 transition-colors flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                    <span>Asignar Pagos</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination()}
      </div>

      {/* Mostrar detalles del empleado */}
      {selectedEmployee && (
        <EmployeeDetails
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* Botón de debug para ver los datos crudos */}
      <button 
        onClick={() => console.log('Datos crudos:', data)}
        className="fixed bottom-4 right-4 bg-gray-100 p-2 rounded-full shadow-lg hover:bg-gray-200"
      >
        🐛 Debug
      </button>
    </div>
  );
}