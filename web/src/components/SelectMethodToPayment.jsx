import React, { useState, useEffect } from 'react';
//import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
//import 'react-datepicker/dist/react-datepicker.css';

const API_URL = 'http://localhost:3000';
const NEW_API_ENDPOINT = `${API_URL}/links/payment-splits`;

const parseDateFromURL = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // ¡Los meses en JS son 0-indexados!
  };

const PaymentSplitForm = ({
  employeeId,
  employeeName,
  employeeRate,
  selectedDate: initialDate,
  totalHours
}) => {
  // Estados corregidos
  const [paymentMethods, setPaymentMethods] = useState([]);
  //const [selectedDate, setSelectedDate] = useState(initialDate ? new Date(initialDate) : null);
  const [selectedDate, setSelectedDate] = useState(parseDateFromURL(initialDate));
  
  const [currentSplit, setCurrentSplit] = useState({ 
    methodId: '', 
    time: '', 
    rate: '',
    methodName: '',  
    currency: ''     
  });
  const [tableRows, setTableRows] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [availableHours, setAvailableHours] = useState(Number(totalHours) || 0);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [errorMethods, setErrorMethods] = useState(null);
  const [employeeHourlyRate] = useState(employeeRate || 0);

  useEffect(() => {
    console.log("Fecha recibida:", initialDate);
    console.log("Fecha parseada:", selectedDate);
  }, [initialDate]);

  
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchPaymentMethods = async () => {
      console.log("🟢 EJECUTANDO FETCH DE MÉTODOS");
      setLoadingMethods(true);
      
      try {
        const response = await fetch(`${API_URL}/links/PaymentMethods`);
  
        console.log("🟠 Status:", response.status);
        
        if (!response.ok) throw new Error(`Error ${response.status}`);
        
        const data = await response.json();
        console.log("📦 Data recibida:", data);
        
        if (!Array.isArray(data)) throw new Error("Formato inválido");
        
        setPaymentMethods(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("🔴 Error:", error);
          setErrorMethods(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingMethods(false);
        }
      }
    };
  
    fetchPaymentMethods();
    
    return () => controller.abort();
  }, []);
  
  // Calcula el total de horas
  useEffect(() => {
    const total = tableRows.reduce((acc, row) => acc + Number(row.time || 0), 0);
    setTotalTime(total);
  }, [tableRows]);

  const handleUpdatePayments = async () => {
    if (!selectedDate) {
      alert('Por favor selecciona una fecha primero');
      return;
    }
  
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    console.log("Fecha en ToPayment:" +  formattedDate);
    try {
      const response = await fetch(`${API_URL}/links/update-employee-payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formattedDate
        })
      });
  
      if (response.ok) {
        alert('Pagos actualizados exitosamente');
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar pagos: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error al actualizar pagos:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const fetchPaymentMethodDetails = async (methodId) => {
    try {
      const response = await fetch(`${API_URL}/links/PaymentMethodsId/${methodId}`)
      if (!response.ok) throw new Error('Error en la respuesta');
      const data = await response.json();
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      console.error('Error obteniendo método:', error);
      return null;
    }
  };

  const handleMethodChange = async (methodId) => {
    if (!methodId) return;
    
    const methodDetails = await fetchPaymentMethodDetails(methodId);
    if (methodDetails) {
      setCurrentSplit(prev => ({
        ...prev,
        methodId,
        methodName: methodDetails.name, // Guardar nombre
        currency: methodDetails.currency, // Guardar moneda
        rate: Number(methodDetails.cambio) || ""
      }));
    }
  };

  const handleAddToTable = () => {
    const time = Number(currentSplit.time);
    // Validación mejorada
    if (!currentSplit.methodId || !time || time <= 0) {
      alert('Complete todos los campos requeridos');
      return;
    }

    const newTotal = totalTime + time;
    if (newTotal > availableHours) {
      alert(`Horas excedidas: Disponibles ${availableHours - totalTime}`);
      return;
    }

    setTableRows([...tableRows, { 
      ...currentSplit,
      time: time.toFixed(4) // Formato consistente
    }]);
    
    // Resetear controles correctamente
    setCurrentSplit({ 
      methodId: '', 
      time: '0', 
      rate: '',
      methodName: '',
      currency: ''
    });
  };

  const handleRemoveRow = (index) => {
    const newRows = tableRows.filter((_, i) => i !== index);
    setTableRows(newRows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (totalTime !== availableHours) {
      alert('El total de horas debe coincidir con las horas disponibles');
      return;
    }

    try {
      const response = await fetch(NEW_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employeeId,
          date: format(selectedDate, 'yyyy-MM-dd'),
          splits: tableRows.map(row => ({
            payment_method_id: row.methodId,
            hours: row.time,
            exchange_rate: row.rate
          }))
        })
      });

      if (response.ok) {
        alert('Datos guardados exitosamente');
        setTableRows([]);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto mt-2 p-4 max-w-2xl">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {employeeName}
          <span className="text-blue-600 ml-2">({employeeId})</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Fecha: {selectedDate && format(selectedDate, 'yyyy/MM/dd')}
          <br />
          Tasa por hora: {employeeHourlyRate}
        </p>
      </div>

      <div className="mb-4">
      {/*  <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="yyyy/MM/dd"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          disabled
        />
        */}
          <div className="flex items-center gap-2">
              <label htmlFor="date-select" className="text-sm font-medium text-gray-700">
                Filtrar por fecha:
              </label>
              <input
                type="date"
                id="date-select"
                value={selectedDate}
                onChange={date => setSelectedDate(date)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
        <small className="mt-1 text-sm text-blue-500">
          Horas disponibles: {availableHours}
        </small>
      </div>
      <div className="mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label>Método de pago:</label>
          {loadingMethods ? (
          <div className="p-2 border rounded bg-gray-100 text-center text-gray-500">
            <span className="animate-spin inline-block mr-2">↻</span>
            Cargando métodos de pago...
          </div>
        ) : errorMethods ? (
          <div className="p-2 border rounded bg-red-100 text-red-600">
            Error: {errorMethods}
            <button 
              onClick={() => window.location.reload()}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <select
            value={currentSplit.methodId}
            onChange={(e) => handleMethodChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Seleccionar</option>
            {paymentMethods.map(method => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
          </select>
        )}
      
        </div>

        <div className="flex-1">
          <label>Horas:</label>
          <input
            type="number"
            value={currentSplit.time}
            onChange={(e) => setCurrentSplit(prev => ({ ...prev, time: e.target.value }))}
            className="w-full p-2 border rounded"
            step="0.0001"
            required
          />
        </div>

        <div className="flex-1">
          <label>Tasa:</label>
          <input
            type="number"
            value={currentSplit.rate}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <button
          type="button"
          onClick={handleAddToTable}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Agregar
        </button>
      </div>

      <div className="mb-6">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Método</th>
              <th className="p-2 border">Horas</th>
              <th className="p-2 border">Tasa</th>
              <th className="p-2 border">Total ({employeeHourlyRate}/h)</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index}>
                <td className="p-2 border">
                  {row.methodName} ({row.currency})
                </td>
                <td className="p-2 border">{row.time}</td>
                <td className="p-2 border">{row.rate}</td>
                <td className="p-2 border">
                  {(row.time * employeeHourlyRate * row.rate).toFixed(2)}
                </td>
                <td className="p-2 border">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`mb-6 p-4 rounded-lg ${
        totalTime > availableHours ? 'bg-red-100' : 'bg-blue-100'
      }`}>
        <div className="flex justify-between">
          <span>Total horas asignadas:</span>
          <span>
            {totalTime} / {availableHours}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={totalTime !== availableHours}
        className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        Guardar distribución
      </button>

      
    <button
      type="button"
      onClick={handleUpdatePayments}
      className="w-full py-2 px-4 bg-purple-500 text-white rounded hover:bg-purple-600"
    >
      Calcular y Actualizar Pagos
    </button>
    </form>
  );
};

export default PaymentSplitForm;