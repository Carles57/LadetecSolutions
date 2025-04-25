import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const API_URL =  'http://localhost:3000';

const TasasCambioForm = (selectedMethodId, onClose) => {
  const [formData, setFormData] = useState({
    id_methods: '',
    date: '',
    cambio: ''
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (selectedMethodId) {
      setFormData(prev => ({
        ...prev,
        id_methods: selectedMethodId.toString()
      }));
    }
  }, [selectedMethodId]);

  // Cargar métodos de pago
  useEffect(() => {
    const fetchMethods = async () => {
      console.log("Entro a seleccionar los metodos");
      try {
        const response = await fetch(`${API_URL}/links/PaymentMethodsAll`);
        const data = await response.json();
        setPaymentMethods(data);
      } catch (err) {
        setError('Error cargando métodos de pago');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMethods();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Formatear a YYYY-MM-DD (10 caracteres)
    const formattedDate = date.toISOString().split('T')[0];
    setFormData({ ...formData, date: formattedDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.id_methods || !formData.date || !formData.cambio) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (isNaN(formData.cambio) || formData.cambio <= 0) {
      setError('La tasa de cambio debe ser un número positivo');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/links/tasas_cambio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_methods: parseInt(formData.id_methods),
          date: formData.date,
          cambio: parseFloat(formData.cambio)
        })
      });

      if (response.ok) {
        setSuccess('Tasa de cambio registrada exitosamente');
        setFormData({ id_methods: '', date: '', cambio: '' });
        setSelectedDate(null);
      } else {
        setError('Error al guardar los datos');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Cargando...</div>;

  return (
    <div className="max-w-md mx-auto p-14 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-1">Registro de Tasas de Cambio</h2>
      <h4 className="text-[14px] mb-2 italic text-center">(con respecto al $)</h4>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Método de Pago
          </label>
          <select
              value={formData.id_methods}
              onChange={(e) => setFormData({ ...formData, id_methods: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
              required
              
            >
              <option value="">Seleccionar método</option>
              {paymentMethods.map(method => (
                <option key={method.id} value={method.id.toString()}> {/* Asegurar conversión a string */}
                  {method.name} ({method.currency_code})
                </option>
              ))}
            </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholderText="Seleccionar fecha"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tasa de Cambio
          </label>
          <input
            type="number"
            step="0.000001"
            value={formData.cambio}
            onChange={(e) => setFormData({ ...formData, cambio: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: 1.25"
            required
          />
        </div>

        <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex-1 mr-2"
            >
              Guardar Tasa
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex-1"
            >
              Cerrar
            </button>
          </div>
      </form>
    </div>
  );
};

export default TasasCambioForm;