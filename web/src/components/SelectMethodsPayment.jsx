import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

const API_URL = 'http://localhost:3000';

const PaymentSplitForm = ({ 
  employeeId, 
  employeeName, 
  employeeRate,
  selectedDate: initialDate,
  totalHours
}) => {
  // Estados (todos se usan)
  const [paymentMethods, setPaymentMethods] = useState([]); // <- Aquí están los métodos
  const [selectedDate, setSelectedDate] = useState(initialDate ? new Date(initialDate) : null);
  const [splits, setSplits] = useState([{ methodId: '', time: '', rate: '' }]); // <- Splits
  const [totalTime, setTotalTime] = useState(0); // <- TotalTime
  const [availableHours, setAvailableHours] = useState(Number(totalHours) || 0);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [errorMethods, setErrorMethods] = useState(null); 
  const [employeeHourlyRate, setEmployeeHourlyRate] = useState(employeeRate || 0); 

  
  const handleAddSplit = () => {
    setSplits([...splits, { methodId: '', time: '', rate: '' }]);
  };

  
   const handleRemoveSplit = (index) => {
    const newSplits = splits.filter((_, i) => i !== index);
    setSplits(newSplits);
  };

  

  const handleSplitChange = async (index, field, value) => {
    if (field === 'methodId' && value) {
      const methodDetails = await fetchPaymentMethodDetails(value);    
    
      console.log("Detalles del método:", methodDetails);      
      if (methodDetails) {
        const newSplits = splits.map((split, i) => 
          i === index ? { 
            ...split, 
            [field]: value,
            rate:  Number(methodDetails.cambio) ?? "" 
          } : split
        );
        
    
        console.log("Nuevo estado de splits:", newSplits);
        
        return setSplits(newSplits);
      }
    }
  
    const newSplits = splits.map((split, i) => 
      i === index ? { ...split, [field]: value } : split
    );
    setSplits(newSplits);
  };



 
  const fetchPaymentMethodDetails = async (methodId) => {
    try {
      const response = await fetch(`${API_URL}/links/PaymentMethodsId/${methodId}`);
      if (!response.ok) throw new Error('Error en la respuesta');
      const data = await response.json();
      console.log("Respuesta del backend:", data);
      console.log("Respuesta del backend (raw):", data);
       const firstItem = Array.isArray(data) ? data[0] : data;
       console.log("Primer elemento del array:", firstItem);
       console.log("Valor de 'cambio':", firstItem.cambio);
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      console.error('Error obteniendo método:', error);
      return null;
    }
  };

   // 1. Carga de métodos de pago con manejo de errores
   useEffect(() => {
    const fetchPaymentMethods = async () => {
      setLoadingMethods(true);
      setErrorMethods(null);
      
      try {
        const response = await fetch(`${API_URL}/links/PaymentMethods`, {
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include' // Si usas cookies
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // 2. Validar formato de datos
        if (!Array.isArray(data)) {
          throw new Error('Formato de respuesta inválido: se esperaba un array');
        }

        setPaymentMethods(data);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setErrorMethods(error.message);
        setPaymentMethods([]); // Reset para evitar datos corruptos
      } finally {
        setLoadingMethods(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Efecto para calcular el tiempo total (usa splits)
  useEffect(() => {
    const calculatedTotal = splits.reduce((acc, split) => acc + Number(split.time || 0), 0);
    setTotalTime(calculatedTotal);
  }, [splits]);

  // Handler para enviar el formulario (usa todos los elementos)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (totalTime > availableHours) {
      alert('El tiempo total excede las horas disponibles');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/links/payment-splits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: employeeId,
          date: format(selectedDate, 'yyyy-MM-dd'), // Formato correcto para la BD
          splits: splits.map(split => ({
            payment_method_id: split.methodId,
            hours: split.time,
            exchange_rate: split.rate
          }))
        })
      });

      if (response.ok) {
        alert('División guardada exitosamente');
        setSplits([{ methodId: '', time: '', rate: '' }]);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  // JSX completo (todos los elementos están presentes)
  return (
    <form onSubmit={handleSubmit} className="container mx-auto mt-2 p-4 max-w-2xl">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Distribución de pagos para: 
          <span className="text-blue-600 ml-2">{employeeName}</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          ID Empleado: {employeeId} | Fecha: {selectedDate && format(selectedDate, 'yyyy/MM/dd')}
          <p>Tasa por hora: <span className="font-semibold">{employeeHourlyRate} {paymentMethods.find(m => m.id === splits[0]?.methodId)?.currency || ''}</span></p>

        </p>
      </div>

      

      {/* Sección del DatePicker */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Fecha de cierre:
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="yyyy/MM/dd"
          placeholderText="Seleccione la fecha"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
        <small className="mt-1 ml-4 text-sm text-blue-500 text-semibold italic">
          Horas disponibles: {availableHours}
        </small>
      </div>

      {/* Sección de Splits (usa paymentMethods y splits) */}
      <div className="mb-6">
        <h5 className="text-lg font-semibold mb-3">Distribución de pagos</h5>
        {splits.map((split, index) => (
          <div key={index} className="space-y-3 mb-4">
          <div className="flex gap-3 items-start">
            <div className="mb-4">
               
                
                {loadingMethods ? (
                  <p>Cargando métodos...</p>
                ) : errorMethods ? (
                  <p className="text-red-500">Error: {errorMethods}</p>
                ) : (
                  <div className="mb-4 text-center text-semibold italic">
                      <label className="block text-sm font-medium text-gray-700">
                      Seleccionar
                      </label>
                  <select
                    value={split.methodId}
                    onChange={(e) => handleSplitChange(index, 'methodId', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name} ({method.currency })
                      </option>
                    ))}
                  </select>
                 </div> 
                )}
              </div>

              {split.time && (
                <p className="text-xs text-gray-500 mt-8">
                  Total: {(split.time * employeeHourlyRate * (split.rate || 1)).toFixed(2)} 
                  {paymentMethods.find(m => m.id === split.methodId)?.currency || ''}
                </p>
              )}
               <div className="mb-4 text-center text-semibold italic">
                  <label className="block text-sm font-medium text-gray-700">
                  Asignar
                  </label>
                 
              <input
                type="number"
                className="w-24 rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Horas"
                min="0"
                step="0.0001"
                value={split.time}
                onChange={(e) => handleSplitChange(index, 'time', e.target.value)}
                required
              />
              </div>
              <div className="mb-4 text-center text-semibold italic">
                      <label className="block text-sm font-medium text-gray-700">
                      Cambio
                      </label>
              <input
                 type="number"
                 className="w-32 rounded-md border-gray-300 shadow-sm 
                   focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                 placeholder="Tasa"
                 step="0.0001"
                 value={split.rate}
                 onChange={(e) => handleSplitChange(index, 'rate', e.target.value)}
                 readOnly={!!split.rate} // Bloquea si ya tiene valor
                 required
              />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm font-medium text-red-600 
                    hover:text-red-800 transition-colors"
                  onClick={() => handleRemoveSplit(index)}
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
        
        <button
          type="button"
          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent 
            text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 
            hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-indigo-500"
          onClick={handleAddSplit}
        >
          Añadir método
        </button>
      </div>

      {/* Sección del Total (usa totalTime) */}
      <div className={`mb-6 p-4 rounded-lg border ${
        totalTime > availableHours 
          ? 'bg-red-50 border-red-200 text-red-700' 
          : 'bg-blue-50 border-blue-200 text-blue-700'
      }`}>
        <div className="flex justify-between items-center">
          <span>Total de horas distribuidas:</span>
          <span className="font-medium">
            {totalTime} / {availableHours}
          </span>
        </div>
        {totalTime > availableHours && (
          <div className="mt-2 text-sm">
            ¡Exceso de horas: {totalTime - availableHours}!
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={totalTime !== availableHours}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent 
          shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 
          hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
          focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Guardar distribución
      </button>
    </form>
  );
};

export default PaymentSplitForm;