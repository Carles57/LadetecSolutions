import { useState } from 'react';
const API_URL = 'http://localhost:3000';

const RunSync = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingData, setExistingData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const formatDateToYYYYMM = (dateString) => {
    if (!dateString) return '';
    console.log("Fecha recibida:", dateString);
    
    // Dividir por '-' (formato YYYY-MM-DD del input date)
    const [year, month] = dateString.split('-');
    
    console.log("Año:", year);
    console.log("Mes:", month);
    
    if (!year || !month) {
        console.error("Formato de fecha inválido");
        return '';
    }

    // Asegurar formato correcto
    const formattedYear = year.padStart(4, '0');
    const formattedMonth = month.padStart(2, '0');

    return `${year}-${month}`;
};



  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return '';
    console.log(dateString);
    // Asumimos que dateString viene en formato YYYY/MM/DD (del input date)
    const [year, month] = dateString.split('/');
    console.log(year);
    console.log(month);
    // Aseguramos 4 dígitos para el año y 2 para el mes
    const formattedYear = year.padStart(4, '0');
    const formattedMonth = month.padStart(2, '0');

    return `${formattedYear}-${formattedMonth}`;
};

  

  const handleDateChange = (e) => {
    const rawValue = e.target.value;
    // Convertir de YYYY-MM-DD a DD/MM/YYYY para visualización
    if (rawValue) {
        setSelectedDate(rawValue); // Guardamos el formato original
    } else {
      setSelectedDate('');
    }
    setMessage('');
    setError('');
    setExistingData(null);
    setShowConfirmation(false);
  };

  const checkExistingData = async (month, year) => {
    try {
      const response = await fetch(`${API_URL}/links/checkdata`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
          },
          credentials: 'include', // Si usas cookies
          body: JSON.stringify({ month, year }),
        });

     

      const data = await response.json();
      return data.exists ? data : null;
    } catch (err) {
      console.error('Error al verificar datos:', err);
      return null;
    }
  };

  const executeSync = async (month, year, overwrite = false) => {
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${API_URL}/links/runscript_employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month, year, overwrite }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Sincronización completada exitosamente');
      } else {
        setError(data.error || 'Error en la ejecución del script');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
      setExistingData(null);
      setShowConfirmation(false);
    }
  };

  

const handleExecute = async () => {
    if (!selectedDate) {
        setError('Por favor selecciona una fecha válida');
        return;
    }

    // Extraemos directamente de YYYY-MM-DD
    const [year, month] = selectedDate.split('-');
    
const monthNum = month; // parseInt(month, 10);
    const yearNum = year; // parseInt(year, 10);

    if (isNaN(monthNum) || isNaN(yearNum)) {
        setError('Fecha inválida');
        return;
    }

    // Verificar datos existentes
    const data = await checkExistingData(monthNum, yearNum);
    
    if (data) {
        setExistingData(data);
        setShowConfirmation(true);
    } else {
        executeSync(monthNum, yearNum);
    }
};

const handleConfirmOverwrite = () => {
    const [year, month] = selectedDate.split('-');
    executeSync(parseInt(month, 10), parseInt(year, 10), true);
};
  

 
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <label htmlFor="sync-date" className="block text-sm font-medium text-gray-700 mb-1">
          Seleccionar fecha de referencia:
        </label>
        <input
          type="date"
          id="sync-date"
          value={formatDateToYYYYMM(selectedDate)}
          onChange={handleDateChange}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Fecha seleccionada: {selectedDate || 'Ninguna'}
        </p>
      </div>

      <button
        onClick={handleExecute}
        disabled={!selectedDate || isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          !selectedDate || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </>
        ) : (
          'Sincronizar Registro de Tiempos'
        )}
      </button>

      {showConfirmation && existingData && (
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">¡Datos existentes encontrados!</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Ya existen registros para {selectedDate}. ¿Desea borrar los datos existentes y actualizarlos?
                </p>
                <p className="mt-1 font-semibold">
                  Registros encontrados: {existingData.count}
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    onClick={handleConfirmOverwrite}
                    className="mr-2 px-2 py-1.5 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sí, sobrescribir
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-2 py-1.5 rounded-md text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{message}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunSync;