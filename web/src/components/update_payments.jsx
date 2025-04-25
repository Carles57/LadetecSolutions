import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
//import { removeTrailingForwardSlash } from 'node_modules/astro/dist/core/path';

const API_URL = 'http://localhost:3000';
//const initialDate = "2025-03-04";
const PaymentUpdater = ({ initialDate }) => {
    const [selectedDate, setSelectedDate] = useState(initialDate ? new Date(initialDate) : new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [action, setAction] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

  }

  const handleUpdatePayments = async () => {
    if (!selectedDate) {
      setErrorMessage('Por favor selecciona una fecha');
      console.log("Me retorno..");
      return;
    }
    console.log("Entro al procedimiento");
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await fetch(`${API_URL}/links/update-employee-payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedDate: format(selectedDate, 'yyyy-MM-dd'),
          action: action || null
        }),
      });      
      const data = await response.json();      
      if (!response.ok) {
        throw new Error(data.error || `Error HTTP: ${response.status}`);
      }      
      setSuccessMessage(`Proceso completado para ${format(selectedDate, 'MMMM yyyy')}`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto mt-2 p-4 max-w-2xl">
   <div className="container mx-auto mt-2 p-4 max-w-2xl"> 
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Generar Liquidación Mensual</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha de referencia (mes/año):</label>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
           dateFormat="yyyy/MM/dd"
           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
           focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
         required
          />
        </div>

        {/* Resto del componente permanece igual */}
        <div>
          <label className="block text-sm font-medium mb-1">Acción para registros existentes:</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full p-2 border rounded-md bg-white"
            disabled={isLoading}
          >
            <option value="">Mantener existentes</option>
            <option value="invalidar">Invalidar anteriores</option>
            <option value="sobrescribir">Eliminar anteriores</option>
          </select>
        </div>

        <button
          onClick={handleUpdatePayments}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Procesando...' : 'Generar Liquidación'}
        </button>

        {errorMessage && (
          <div className="text-red-600 p-3 bg-red-50 rounded-md">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="text-green-600 p-3 bg-green-50 rounded-md">
            {successMessage}
          </div>
        )}
      </div>
    </div>
    </div>
    </form>
  );
};

export default PaymentUpdater;