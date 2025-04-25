import React, { useState, useEffect } from 'react';

const API_URL =  'http://localhost:3000';

const PaymentSplitForm = ({ employeeId }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [splits, setSplits] = useState([{ methodId: '', time: '', rate: '' }]);
  const [totalTime, setTotalTime] = useState(0);
  const [availableHours, setAvailableHours] = useState(0);

  // Cargar métodos de pago y horas disponibles
  useEffect(() => {
    // Simular llamada API para métodos de pago
    const fetchPaymentMethods = async () => {
      const response = await fetch('/links/payment-methods');
      const data = await response.json();
      setPaymentMethods(data);
    };
    
    fetchPaymentMethods();
  }, []);

  // Actualizar horas disponibles cuando cambia la fecha
  useEffect(() => {
    const fetchAvailableHours = async () => {
      if (selectedDate && employeeId) {
        const response = await fetch(`${API_URL}/analytic-time?employee=${employeeId}&date=${selectedDate}`);
        const data = await response.json();
        setAvailableHours(data.total_hours);
      }
    };
    
    fetchAvailableHours();
  }, [selectedDate, employeeId]);

  // Calcular tiempo total
  useEffect(() => {
    const calculatedTotal = splits.reduce((acc, split) => acc + Number(split.time || 0), 0);
    setTotalTime(calculatedTotal);
  }, [splits]);

  const handleAddSplit = () => {
    setSplits([...splits, { methodId: '', time: '', rate: '' }]);
  };

  const handleRemoveSplit = (index) => {
    const newSplits = splits.filter((_, i) => i !== index);
    setSplits(newSplits);
  };

  const handleSplitChange = (index, field, value) => {
    const newSplits = splits.map((split, i) => 
      i === index ? { ...split, [field]: value } : split
    );
    setSplits(newSplits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (totalTime > availableHours) {
      alert('El tiempo total excede las horas disponibles');
      return;
    }

    try {
      const response = await fetch('/links/payment-splits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          date: selectedDate,
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



  return (
    <form onSubmit={handleSubmit} className="container mx-auto mt-4 p-4 max-w-2xl">
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Mes de cierre:
        </label>
        <input
          type="month"
          id="date"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        />
        <small className="mt-1 text-sm text-gray-500">
          Horas disponibles: {availableHours}
        </small>
      </div>

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

