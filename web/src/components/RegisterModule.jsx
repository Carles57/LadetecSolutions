import React, { useState } from 'react';

const API_URL = 'http://localhost:3000/links'; // URL base del backend

const RegisterModule = () => {
  const [moduleName, setModuleName] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!moduleName || !moduleDescription) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/create_permission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: moduleName,
          description: moduleDescription,
        }),
      });

      // Verifica el código de estado de la respuesta
      if (!response.ok) {
        const errorText = await response.text(); // Obtén el texto de la respuesta
        console.error('Error del servidor:', errorText); // Muestra el error en la consola
        throw new Error(
          `Error HTTP: ${response.status} - ${response.statusText}. Detalle: ${errorText}`
        );
      }

      // Intenta analizar la respuesta como JSON
      const data = await response.json();
      setMessage(data.message);
      setModuleName('');
      setModuleDescription('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Registrar Módulo</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700">
              Nombre del Módulo:
            </label>
            <input
              type="text"
              id="moduleName"
              name="moduleName"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="moduleDescription" className="block text-sm font-medium text-gray-700">
              Descripción del Módulo:
            </label>
            <textarea
              id="moduleDescription"
              name="moduleDescription"
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Registrar Módulo
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-center text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

export default RegisterModule;