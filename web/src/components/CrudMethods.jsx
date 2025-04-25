// src/components/CRUD.jsx

import React, { useState, useEffect, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faUsers } from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:3000';

// Estilos para la tabla y formulario
const tableStyle = "min-w-full divide-y divide-gray-200";
const inputStyle = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500";
const buttonStyle = "px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700";

const CRUD = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    activo: 1
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // Obtener datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/links/PaymentAllMethods`);
      console.log("Los metodos: " + response);
      if (!response.ok) throw new Error('Error al obtener datos');
      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = editingId 
      ? `${API_URL}/links/update_methods/${editingId}`
      : `${API_URL}/links/update_methods`;
      
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(editingId ? 'Error al actualizar' : 'Error al crear');

      fetchData();
      setFormData({ name: '', activo: 1 });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      activo: item.activo
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;
    
    try {
      const response = await fetch(`${API_URL}/links/PaymentMethodsId/${id}`, { 
        method: 'DELETE' 
      });
      if (!response.ok) throw new Error('Error al eliminar');
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Metodos y Tasas de Pago</h1>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={inputStyle}
                required
              />
            </label>
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="activo"
                checked={formData.activo === 1}
                onChange={handleInputChange}
                className="rounded text-indigo-600"
              />
              <span className="text-sm text-gray-700">Activo</span>
            </label>
          </div>

          <button type="submit" className={buttonStyle}>
            {editingId ? 'Actualizar Registro' : 'Crear Nuevo Registro'}
          </button>
        </div>
      </form>

      {/* Mensajes de error */}
      {error && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</div>}

      {/* Tabla de datos */}
      <div className="overflow-x-auto">
        <table className={tableStyle}>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.activo ? '✅' : '❌'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRUD;