// components/RunSync.jsx
import { useState } from 'react';

const RunSync = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setMessage('');
    setError('');
  };

  const executePythonScript = async () => {
    if (!selectedDate) {
      setError('Por favor selecciona una fecha válida');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // Obtener el mes de la fecha seleccionada
      const dateObj = new Date(selectedDate);
      const month = dateObj.getMonth() + 1; // Meses de 1-12
      const year = dateObj.getFullYear();
      
      // Ejecutar el script Python a través de una API route
      const response = await fetch('/links/runscript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month, year }),
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
    }
  };

  return (
    <div className="sync-container">
      <div className="date-selection">
        <label htmlFor="sync-date">Seleccionar fecha de referencia:</label>
        <input
          type="date"
          id="sync-date"
          value={selectedDate}
          onChange={handleDateChange}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      <button 
        onClick={executePythonScript}
        disabled={!selectedDate || isLoading}
        className="sync-button"
      >
        {isLoading ? 'Ejecutando...' : 'Sincronizar Empleados'}
      </button>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <style>{`
        .sync-container {
          max-width: 500px;
          margin: 2rem auto;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .date-selection {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        input[type="date"] {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
        }

        .sync-button {
          background-color: #3b82f6;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .sync-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .success-message {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #dcfce7;
          color: #166534;
          border-radius: 4px;
        }

        .error-message {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #fee2e2;
          color: #991b1b;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default RunSync;