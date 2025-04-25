import { useState, useEffect } from 'react';
import MonthlyChart from './MonthlyChart';

const EmployeePaymentsTable = () => {
  const [allPayments, setAllPayments] = useState([]);
  const [displayedPayments, setDisplayedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalDevengar, setTotalDevengar] = useState(0);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [noResults, setNoResults] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
const [employeeChartData, setEmployeeChartData] = useState([]);
const [chartLoading, setChartLoading] = useState(false);

  const API_URL = 'http://localhost:3000';

  // Obtener la fecha actual en formato yyyy-MM-dd
  function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }  

  const handleEmployeeClick = async (employeeId) => {
    try {
      setChartLoading(true);
      setSelectedEmployee(employeeId);
      console.log("Id del empleado: " + employeeId );
      const response = await fetch(`${API_URL}/links/getEmployeePayments/${employeeId}`);
      const data = await response.json();
      console.log("Luego de llamar a la consulta: " + data);
      if (!response.ok) throw new Error(data.message || 'Error en datos');
      
      // Transformar datos a formato requerido por el gráfico
      const formattedData = data.map(item => ({
        mes: `${item.year}-${item.month.toString().padStart(2, '0')}`,
        total: parseFloat(item.total_devengar)
      }));
      
      setEmployeeChartData(formattedData);
    } catch (err) {
      console.error('Error al cargar datos del gráfico:', err);
      setEmployeeChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError('');
        
        const dateObj = new Date(selectedDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        
        console.log("Year en el Frontend: " + year);
        console.log("Mes en el Frontend: " + month);
        const response = await fetch(`${API_URL}/links/getAllPayments/${year}/${month}`);
        
        if (!response.ok) throw new Error('Error al obtener datos');
        
      

        const data = await response.json();
        console.log("Datos crudos recibidos:", data);
  
        // Verificación robusta
        const isDataValid = Array.isArray(data) && data.length > 0;
        
        if (!isDataValid) {
          setNoResults(true);
          setAllPayments([]);
          setTotalDevengar(0);
        } else {
          console.log("Entre muy bien");
          setNoResults(false);
          setAllPayments(data);
          setTotalDevengar(
            data.reduce((sum, payment) => {
              const value = parseFloat(payment.total_devengar) || 0;
              return sum + value;
            }, 0)
          );
        }
      } catch (err) {
        console.error("Error en fetchPayments:", err);
        setError(err.message);
        setNoResults(false); // Forzar mostrar tabla vacía
      } finally {
        setLoading(false);
      }
    };
  
    fetchPayments();
  }, [selectedDate]);

  useEffect(() => {
    // Actualizar paginación cuando cambian los datos o la página
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedPayments(allPayments.slice(startIndex, endIndex));
    setTotalItems(allPayments.length);
  }, [allPayments, currentPage, itemsPerPage]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1); // Resetear a la primera página al cambiar de fecha
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) return <div className="text-center py-4">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  console.log('Renderizando tabla con:', {
    displayedPayments,
    hasData: displayedPayments.length > 0,
    firstItem: displayedPayments[0]
  });
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Total Devengar: ${totalDevengar.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </h2>
            {!noResults && (
              <p className="text-sm text-gray-500">
                Mostrando {displayedPayments.length} de {totalItems} registros
              </p>
            )}
          </div>
          
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
        </div>
  
        {/* Contenido principal condicional */}
        {loading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">Error: {error}</div>
        ) : noResults ? (
          <div className="p-8 text-center text-gray-500">
            <p>No se encontraron registros para el mes seleccionado.</p>
            <p>Por favor, intenta con otra fecha.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empleado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empleado ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasa Horaria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Devengar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Validado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
  {displayedPayments.map((payment) => {
    // Validación defensiva para cada propiedad
    const tasaHoraria = parseFloat(payment.tasa_horaria || 0);
    const totalDevengar = parseFloat(payment.total_devengar || 0);
    const fechaValida = payment.fecha ? new Date(payment.fecha) : new Date();
    const activo = Boolean(payment.activo);
    const validado = Boolean(payment.validado);
    

    return (
      <tr key={payment.id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <button 
            onClick={() => handleEmployeeClick(payment.id_employee)}
            className="text-blue-600 hover:text-blue-900 font-medium underline"
          >
            {payment.name || `Empleado ${payment.id_employee}`}
          </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {payment.id_employee || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {formatDate(fechaValida)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ${tasaHoraria.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ${totalDevengar.toLocaleString('es-ES', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          {activo ? (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              ✔
            </span>
          ) : (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              ✖
            </span>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          {validado ? (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              ✔
            </span>
          ) : (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              ✖
            </span>
          )}
        </td>
      </tr>
    );
  })}
  </tbody>
 </table>
 {selectedEmployee && (
  <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4">
      Historial de Pagos - Empleado {selectedEmployee}
      <button 
        onClick={() => setSelectedEmployee(null)}
        className="ml-2 text-red-600 hover:text-red-800 text-sm"
      >
        [Cerrar]
      </button>
    </h3>
    
    <MonthlyChart 
      data={employeeChartData}
      loading={chartLoading}
      title={`Evolución mensual de devengos`}
    />
  </div>
)}
</div>
  
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-700">
                    Mostrando página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Primera
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Última
                    </button>
                  </div>
                </div>
              </div>
            )}
          </> // Cierre del fragmento
        )}
      </div>
    </div>
  );
};

export default EmployeePaymentsTable;