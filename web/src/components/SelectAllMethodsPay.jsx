import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

const API_URL = 'http://localhost:3000';

const PaymentSplitForm = ({ employeeId }) => {
  // Estados (todos se usan)
  const [paymentMethods, setPaymentMethods] = useState([]); // <- Aquí están los métodos
  const [selectedDate, setSelectedDate] = useState(null);
  const [splits, setSplits] = useState([{ methodId: '', time: '', rate: '' }]); // <- Splits
  const [totalTime, setTotalTime] = useState(0); // <- TotalTime
  const [availableHours, setAvailableHours] = useState(0);

  // Función para agregar splits 
  const handleAddSplit = () => {
    setSplits([...splits, { methodId: '', time: '', rate: '' }]);
  };

   // Función para eliminar splits
   const handleRemoveSplit = (index) => {
    const newSplits = splits.filter((_, i) => i !== index);
    setSplits(newSplits);
  };

  const handleSplitChange = async (index, field, value) => {
    // Si estamos cambiando el método, obtener detalles
    if (field === 'methodId' && value) {
      const methodDetails = await fetchPaymentMethodDetails(value);
      if (methodDetails) {
        // Actualizar rate automáticamente si existe en los detalles
        const newSplits = splits.map((split, i) => 
          i === index ? { 
            ...split, 
            [field]: value,
            rate: methodDetails.tasa || split.rate // Usar tasa del método si existe
          } : split
        );
        return setSplits(newSplits);
      }
    }
    
    // Actualización normal para otros campos
    const newSplits = splits.map((split, i) => 
      i === index ? { ...split, [field]: value } : split
    );
    setSplits(newSplits);
  };



  const fetchPaymentMethodDetails = async (methodId) => {
    try {
      const response = await fetch(`${API_URL}/links/PaymentMethodsId/${methodId}`);
      if (!response.ok) throw new Error('Error en la respuesta');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo método:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(`${API_URL}/links/PaymentMethods`);
        if (!response.ok) throw new Error('Error en la respuesta');
        
        const data = await response.json();
        setPaymentMethods(data);
        
      } catch (error) {
        console.error('Error cargando métodos de pago:', error);
        setPaymentMethods([]); // Resetear en caso de error
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
          employeeId,
          date: format(selectedDate, 'yyyy-MM-dd'), // Formato correcto para la BD
          splits: splits.map(split => ({
            methodId: split.methodId,
            time: split.time,
            rate: split.rate
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
    <form onSubmit={handleSubmit} className="container mx-auto mt-4 p-4 max-w-2xl">
      {/* Sección del DatePicker */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Fecha de cierre:
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Seleccione la fecha"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
        <small className="mt-1 text-sm text-gray-500">
          Horas disponibles: {availableHours}
        </small>
      </div>

      {/* Sección de Splits (usa paymentMethods y splits) */}
      <div className="mb-6">
        <h5 className="text-lg font-semibold mb-3">Distribución de pagos</h5>
        {splits.map((split, index) => (
          <div key={index} className="space-y-3 mb-4">
            <div className="flex gap-3 items-start">
              <select
                className="flex-1 rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={split.methodId}
                onChange={(e) => handleSplitChange(index, 'methodId', e.target.value)}
                required
              >
                <option value="">Seleccionar método</option>
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name} ({method.currency})
                  </option>
                ))}
              </select>
              
              <input
                type="number"
                className="w-24 rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Horas"
                min="0"
                step="0.5"
                value={split.time}
                onChange={(e) => handleSplitChange(index, 'time', e.target.value)}
                required
              />
              
              <input
                type="number"
                className="w-32 rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Tasa"
                step="0.0001"
                value={split.rate}
                onChange={(e) => handleSplitChange(index, 'rate', e.target.value)}
                required
              />
              
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