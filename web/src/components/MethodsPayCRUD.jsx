import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faCreditCard } from '@fortawesome/free-solid-svg-icons';
// En la sección de imports
import TasasCambioForm from './setTasasCambio'; // Asegúrate de ajustar la ruta
const API_URL = 'http://localhost:3000'; 
//const API_URL = process.env.REACT_APP_API_URL;

export default function PaymentMethodsList() {
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [filteredMethods, setFilteredMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMethod, setEditingMethod] = useState(null);
  const [filter, setFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState(null);
  const [showAddMethodForm, setShowAddMethodForm] = useState(false);
  const [newMethod, setNewMethod] = useState({ 
    name: '', 
    
    activo: true 
  });

  // En la sección de estados
const [showTasasForm, setShowTasasForm] = useState(false);

  const [addMethodError, setAddMethodError] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    if (editingMethod && inputRef.current) {
      inputRef.current.select();
    }
  }, [editingMethod]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch(`${API_URL}/links/PaymentMethodsAll`);
      if (!response.ok) {
        throw new Error('Error al obtener los métodos de pago');
      }
      const data = await response.json();
      setPaymentMethods(data);
      setFilteredMethods(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMethodDetails = async (method) => {
    try {
      const response = await fetch(`${API_URL}/links/PaymentMethodsId/${method.id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles del método de pago');
      }
      const data = await response.json();
      console.log(data);
      setSelectedMethod(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateMethod = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/links/update_methods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el método de pago');
      }
      const data = await response.json();
      setPaymentMethods((prevMethods) =>
        prevMethods.map((method) => (method.id === id ? { ...method, ...updatedData } : method))
      );
      setEditingMethod(null);
      setSelectedMethod(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteMethod = async (id) => {
    try {
      const response = await fetch(`${API_URL}/links/delete_payment_method/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el método de pago');
      }
      const data = await response.json();
      setPaymentMethods((prevMethods) => prevMethods.filter((method) => method.id !== id));
      setFilteredMethods((prevMethods) => prevMethods.filter((method) => method.id !== id));
      setShowDeleteConfirm(false);
      setMethodToDelete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    const filtered = paymentMethods.filter((method) => 
      method.name.toLowerCase().includes(value)
    );
    setFilteredMethods(filtered);
  };

  const handleAddMethod = async (e) => {
    e.preventDefault();
    if (!newMethod.name) {
      setAddMethodError('El nombre es requerido');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/links/create_payment_method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMethod),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el método de pago');
      }
      const data = await response.json();
      setPaymentMethods((prevMethods) => [...prevMethods, data]);
      setFilteredMethods((prevMethods) => [...prevMethods, data]);
      setShowAddMethodForm(false);
      setNewMethod({ name: '',  is_active: true });
      setAddMethodError('');
    } catch (error) {
      setAddMethodError(error.message);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  if (loading) {
    return <div>Cargando métodos de pago...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="p-2 mt-10 max-w-6xl mx-auto"> 
      <h4 className="text-2xl mb-10 md:text-3xl font-semibold text-gray-800 text-center">
        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Métodos de Pago de Honorarios
        </span>
        <FontAwesomeIcon 
          icon={faCreditCard} 
          className="ml-3 text-blue-600 text-xl md:text-2xl align-middle"
        />
      </h4>

      {selectedMethod ? (
        <div className="mt-2">
          <h2 className="text-2xl font-bold pt-2 mb-4 text-center">Detalles del método de pago</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Nombre</td>
                  <td className="border border-gray-300 p-2 w-3/4">{selectedMethod.name}</td>
                </tr>
               
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Estado</td>
                  <td className="border border-gray-300 p-2 w-3/4">
                    {selectedMethod.activo ? 'Activo' : 'Inactivo'}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  setEditingMethod(selectedMethod);
                  setSelectedMethod(null);
                }}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                <FontAwesomeIcon icon={faEdit} /> Actualizar
              </button>
              <button
                  onClick={() => setShowTasasForm(true)}
                  className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 flex-1"
                >
                  Establecer Tasas
             </button>
              <button
                onClick={() => setSelectedMethod(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Volver a la lista
              </button>
            </div>
          </div>
        </div>
      ) : editingMethod ? (
        <div className="mt-2">
          <h2 className="text-2xl font-bold mb-4 text-center">Editar método de pago</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateMethod(editingMethod.id, {
                name: e.target.name.value,
               
                activo: e.target.activo.checked,
              });
            }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <div className="mb-4">
              <label htmlFor="name" className="block font-bold mb-2 italic">
                Nombre
              </label>
              <input
                ref={inputRef}
                type="text"
                id="name"
                name="name"
                defaultValue={editingMethod.name}
                className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                onClick={(e) => e.target.select()}
                onFocus={(e) => e.target.select()}
              />
            </div>
          
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="activo"
                name="activo"
                defaultChecked={editingMethod.activo}
                className="mr-2"
              />
              <label htmlFor="activo" className="font-bold">
                Activo
              </label>
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => setEditingMethod(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between italic">
            <input
              type="text"
              placeholder="Filtrar por nombre..."
              value={filter}
              onChange={handleFilterChange}
              className="border border-gray-300 p-2 w-full rounded"
            />
            <button
              onClick={() => setShowAddMethodForm(true)}
              className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 ml-2"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[300px]">
            {/* Columna de la tabla con scroll */}
            <div className="overflow-x-auto overflow-y-auto shadow-lg rounded-lg border border-gray-200">
              <table className="w-full min-w-[500px]">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="p-2 text-sm border-b">ID</th>
                    <th className="p-2 text-sm border-b">Nombre</th>
                    <th className="p-2 text-sm border-b">Estado</th>
                    <th className="p-2 text-sm border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMethods.map((method) => (
                    <tr key={method.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-1 text-center">{method.id}</td>
                      <td className="border border-gray-300 p-1">
                        <button 
                          onClick={() => fetchMethodDetails(method)}
                          className="text-blue-600 hover:text-blue-800 underline text-sm truncate transition-colors"
                        >
                          {method.name}
                        </button>
                      </td>
                      <td className="border border-gray-300 p-1 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          method.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {method.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-1 text-center flex justify-center items-center">
                        <button
                          onClick={() => fetchMethodDetails(method)}
                          className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 mr-2"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingMethod(method);
                            setSelectedMethod(null);
                          }}
                          className="bg-green-500 text-white p-1 rounded hover:bg-green-600 mr-2"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => {
                            setMethodToDelete(method.id);
                            setShowDeleteConfirm(true);
                          }}
                          className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> 
            <div className="hidden md:flex  min-h-[100px] rounded-lg overflow-hidden border border-gray-200 shadow-lg bg-gray-100">
              <img 
                src="images/ladetec2.jpg" 
                alt="Métodos de pago"
                className="w-50% h-50% object-cover object-center"
              />
            </div>
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">¿Estás seguro de que deseas eliminar este método de pago?</p>
            <div className="flex justify-end">
              <button
                onClick={() => deleteMethod(methodToDelete)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
              >
                Sí
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddMethodForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Agregar método de pago</h2>
            <form onSubmit={handleAddMethod} className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-bold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newMethod.name}
                  onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>
              <div>
                <label htmlFor="description" className="block font-bold mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newMethod.description}
                  onChange={(e) => setNewMethod({ ...newMethod, description: e.target.value })}
                  className="border border-gray-300 p-2 w-full rounded"
                  rows="3"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={newMethod.activo}
                  onChange={(e) => setNewMethod({ ...newMethod, activo: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="activo" className="font-bold">
                  Activo
                </label>
              </div>
              {addMethodError && <p className="text-red-500">{addMethodError}</p>}
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMethodForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
         {showTasasForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <TasasCambioForm 
                selectedMethodId={selectedMethod.id} 
                onClose={() => setShowTasasForm(false)}
              />
            </div>
          </div>
        )}
    </div>
  );
}