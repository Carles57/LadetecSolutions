import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';



const API_URL = 'http://localhost:3000';

export default function HoursReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState('2025-02-24');
 

  const fetchData = async (date) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/links/employee_hours/2025-02-24`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Procesamiento seguro de datos
      const processedData = result.map(item => ({
        id: item.id,
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
    fetchData(selectedDate);
  }, [selectedDate]);

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    const filtered = data.filter(item => 
      item.name.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
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
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 inline-block">
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Reporte de horas
          </span>
          <FontAwesomeIcon 
            icon={faClock} 
            className="ml-3 text-blue-600 align-middle"
          />
        </h1>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
          />
          <FontAwesomeIcon
            icon={faCalendar}
            className="absolute right-3 top-3 text-gray-400"
          />
        </div>
        
        <input
          type="text"
          placeholder="Filtrar por nombre..."
          value={filter}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Empleado</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Horas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item) => (
              <tr key={`${item.id}-${item.date}`} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{item.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100">
                    {item.horas.toFixed(2)} hrs
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredData.length === 0 && !loading && (
          <div className="p-6 text-center text-gray-500">
            No se encontraron registros para esta fecha
          </div>
        )}
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