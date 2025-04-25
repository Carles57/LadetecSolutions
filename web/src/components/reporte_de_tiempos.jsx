import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendar,faTimes, faUserClock } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
//import es from 'date-fns/locale/es';
//registerLocale('es', es);
//import { format, utcToZonedTime } from 'date-fns-tz';
//import moment from "moment-timezone";
import { format } from 'date-fns'; 
import Modal from 'react-modal';  // cambio

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
  return format(date, 'yyyy-MM-dd'); // Ahora usa date-fns con hora local
};

const EmployeeDetailsModal = ({ employee, onClose }) => {
  const [timeDetails, setTimeDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          // Modificado para usar la nueva ruta con parámetros en URL
          `${API_URL}/analytic_time/${employee.employee_id}/${format(employee.date, 'yyyy-MM-dd')}`
        );
        const { data } = await response.json();
        setTimeDetails(data?.tareas || []); // Usamos el campo correcto de la respuesta
      } catch (error) {
        console.error('Error fetching details:', error);
        setTimeDetails([]);
      } finally {
        setLoadingDetails(false);
      }
    };

    if (employee) {
      fetchDetails();
    }
  }, [employee]);

  return (
    <Modal
      isOpen={!!employee}
      onRequestClose={onClose}
      className="modal-container"
      overlayClassName="modal-overlay"
    >
      <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalles de Tiempo: {employee?.name} - {format(employee?.date, 'dd/MM/yyyy')}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {loadingDetails ? (
          <div className="text-center py-4">
            <div className="animate-spin inline-block text-blue-600">🔄</div>
            <p className="mt-2 text-gray-600">Cargando detalles...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 font-medium text-gray-700 border-b pb-2">
              <div>Tarea</div>
              <div>Proyecto</div>
              <div>Tiempo (horas)</div>
            </div>
            
            {timeDetails.length > 0 ? (
              timeDetails.map((detail, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 border-b pb-2">
                  <div className="text-sm text-gray-900">{detail.tarea}</div>
                  <div className="text-sm text-gray-600">{detail.proyecto}</div>
                  <div className="text-sm font-semibold text-blue-600">
                    {detail.horas}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No se encontraron registros para esta fecha
              </div>
            )}

            <div className="pt-4 mt-4 border-t">
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Regresar al Reporte
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default function HoursReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  //const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Fecha actual por defecto
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  //const fechaEnCuba = moment().tz('America/Havana').format('YYYY-MM-DD HH:mm:ss');

  const formatDateToLocal = (date) => {
    const offset = date.getTimezoneOffset() * 60000; // Offset en milisegundos
    const localDate = new Date(date - offset);
    return localDate.toISOString().split('T')[0];
  };

  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Crea fecha en hora local
  };

  const fetchData = async (date) => { // Ahora recibe string YYYY-MM-DD
    
    const dateString = formatLocalDate(date); // Usar nuevo formateador
    console.log("Fecha ahora: " + dateString);
    try {
      const response = await fetch(`${API_URL}/links/employee_hours/${dateString}`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      
      const result = await response.json();
      
      const processedData = result.map(item => ({
        id: item.id,
        employee_id: item.employee_id,
        name: item.name,
        date: item.date, // Usar valor directo del string
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
    fetchData(selectedDate); // selectedDate ahora es string
  }, [selectedDate]);

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    const filtered = data.filter(item => 
      item.name.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };



 const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Cargando reporte...
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
            Reporte de Horas
          </span>
          <FontAwesomeIcon 
            icon={faClock} 
            className="ml-3 text-blue-600 align-middle"
          />
        </h1>
      </div>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
      <DatePicker       
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          customInput={<CustomInput />}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholderText="Selecciona fecha"
            showPopperArrow={false}
          />
        </div>
        </div>
        
        <input
          type="text"
          placeholder="Filtrar por nombre..."
          value={filter}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      

      {/* Tabla */}
      
<div className="bg-white rounded-lg shadow-lg overflow-x-auto">
  <table className="w-full min-w-[600px]">
    <thead className="bg-gradient-to-r from-blue-600 to-cyan-500">
      <tr>
        {/** Cabeceras con mejor contraste */}
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
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {filteredData.map((item, index) => (
        <tr 
          key={`${item.id}-${item.date}`} 
          className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
        >
          {/** Celdas con mejor alineación */}
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
              date: parseLocalDate(item.date) 
            })}
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faUserClock} className="mr-2" />
            <span>Detalles</span>
          </button>
        </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>




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