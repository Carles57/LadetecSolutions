import React, { useState, useEffect, useRef } from 'react';
//import { View, StyleSheet } from 'react-native';
/*import {
  useNavigation,
  createStaticNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

import Animated from 'react-native-reanimated';

import { Fade } from "react-awesome-reveal";*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faUsers } from '@fortawesome/free-solid-svg-icons';


const API_URL =  'http://localhost:3000';//process.env.REACT_APP_API_URL; //'http://localhost:3000'; 
//const API_URL = process.env.REACT_APP_API_URL;

export default function UserList() {
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', activo: 0 });
  const [addUserError, setAddUserError] = useState('');
  

  const inputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Calcular datos paginados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Selector de items por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Resetear a la primera página al cambiar el tamaño
  };

  const renderTableBody = () => {
    return currentItems.map((user) => (
      <tr 
      key={user.id} 
      className={`
        hover:bg-gray-50 transition-colors duration-300
        ${transitioningId === user.id ? 'bg-blue-50' : ''}
      `}
    >
        <td className="border border-gray-300 p-1 text-center">{user.id}</td>
        <td className="border border-gray-300 p-1">
          <button 
            onClick={() => fetchUserDetails(user)}
            className="text-blue-600 hover:text-blue-800 underline text-sm truncate transition-colors"
          >
            {user.name}
          </button>
        </td>
        <td className="border border-gray-300 p-1 text-center">
          <input
            type="checkbox"
            checked={user.activo === 1}
            onChange={() => toggleActiveStatus(user)}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            disabled={loading}
          />
        </td>
        <td className="border border-gray-300 p-1 text-center flex justify-center items-center">
          <button
            onClick={() => fetchUserDetails(user)}
            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 mr-2"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            onClick={() => {
              setEditingUser(user);
              setSelectedUser(null);
            }}
            className="bg-green-500 text-white p-1 rounded hover:bg-green-600 mr-2"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => {
              setUserToDelete(user.id);
              setShowDeleteConfirm(true);
            }}
            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </td>
      </tr>
    ));
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
      
      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length} registros
          </span>
          
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50, 100].map(size => (
              <option key={size} value={size}>
                {size} por página
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            «
          </button>
          
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            ‹
          </button>

          {startPage > 1 && (
            <button
              onClick={() => paginate(1)}
              className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              1
            </button>
          )}
          
          {startPage > 2 && <span className="px-2 py-1">...</span>}

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages - 1 && <span className="px-2 py-1">...</span>}
          
          {endPage < totalPages && (
            <button
              onClick={() => paginate(totalPages)}
              className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              {totalPages}
            </button>
          )}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            ›
          </button>
          
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            »
          </button>
        </div>
      </div>
    );
  };

  const [transitioningId, setTransitioningId] = useState(null);

  const toggleActiveStatus = async (user) => {
    try {
      setLoading(true);
      
      // Preparamos los datos para enviar
      const updateData = {
        name: user.name, // Incluimos el name que ya existía
        activo: user.activo ? 0 : 1 // Convertimos a 1/0
      };
  
      // Si estamos activando, primero desactivamos todos los demás
      if (!user.activo) {
        await Promise.all(
          users.map(async (method) => {
            if (method.activo) {
              await fetch(`${API_URL}/links/update_methods/${method.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: method.name,
                  activo: 0
                }),
              });
            }
          })
        );
      }
  
      // Actualizamos el método seleccionado
      const response = await fetch(`${API_URL}/links/update_methods/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el estado');
      }
  
      // Actualizamos el estado local
      setUsers(prevUsers =>
        prevUsers.map(method => ({
          ...method,
          activo: method.id === user.id ? (user.activo ? 0 : 1) : 0
        }))
      );
      
      setFilteredData(prevData =>
        prevData.map(method => ({
          ...method,
          activo: method.id === user.id ? (user.activo ? 0 : 1) : 0
        }))
      );
  
    } catch (error) {
      console.error('Error detallado:', error);
      setError(`Error al actualizar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editingUser && inputRef.current) {
      inputRef.current.select();
    }
  }, [editingUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/links/PaymentMethods`);
      if (!response.ok) {
        throw new Error('Error al obtener Los Metodos de Pago');
      }
      const data = await response.json();


      const processedData = data.map(item => ({
                id: item.id,
                name: item.name,
                activo: item.activo
                
              }));


      setUsers(processedData);
      //setFilteredUsers(data);
      setFilteredData(processedData);
    } catch (error) {
      setError(error.message);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchUserDetails = async (user) => {
    try {
      const response = await fetch(`${API_URL}/links/PaymentMethodsId/${user.id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles del empleado');
      }
      const data = await response.json();
      console.log(data);
      setSelectedUser(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateUser = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/links/update_methods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el empleado');
      }
      const data = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? { ...user, ...updatedData } : user))
      );
      setEditingUser(null);
      setSelectedUser(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/links/delete_user/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
      const data = await response.json();
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    const filtered = users.filter((user) => user.name.toLowerCase().includes(value));
    setFilteredData(filtered);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/links/create_methods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name,
          activo: newUser.activo ? 1 : 0
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el usuario');
      }
      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, data]);
      setFilteredUsers((prevUsers) => [...prevUsers, data]);
      setShowAddUserForm(false);
      await fetchUsers();

      
      setNewUser({ ...newUser, activo: e.target.checked ? 1 : 0 });
      setAddUserError('');
    } catch (error) {
      setAddUserError(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    //fetchRoles(); // Obtener roles al cargar el componente
  }, []);

  // Mostrar el formulario de creación automáticamente si no hay usuarios
  useEffect(() => {
    if (users.length === 0 && !showAddUserForm) {
      //setShowAddUserForm(true);
    }
  }, [users, showAddUserForm]);

  if (loading) {
    return <div>Cargando metodos de pago...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;

   
  }
  
  return (
    <div className="p-2 max-w-6xl mx-auto"> 
      <h4 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">
      <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Metodos de Pago en Ladetec
      </span>
      <FontAwesomeIcon 
      icon={faUsers} 
      className="ml-3 text-blue-600 text-xl md:text-2xl align-middle"
    />
      </h4>

      {selectedUser ? (
        <div className="mt-2">
          <h2 className="text-2xl font-bold pt-2 mb-4 text-center">Detalles de los Metodos</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Concepto</td>
                  <td className="border border-gray-300 p-2 w-3/4">{selectedUser.name}</td>
                </tr>
               
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Activo</td>
                  <td className="border border-gray-300 p-2 w-3/4">{selectedUser.activo}</td>
                </tr>
                
              </tbody>
            </table>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  setEditingUser(selectedUser);
                  setSelectedUser(null);
                }}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                <FontAwesomeIcon icon={faEdit} /> Actualizar
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Volver a la lista
              </button>
            </div>
          </div>
        </div>
      ) : editingUser ? (
        <div className="mt-2">
          <h2 className="text-2xl font-bold mb-4 text-center">Editar el Metodo de Pago</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUser(editingUser.id, {
                name: e.target.name.value,
                activo: e.target.activo.value,
              });
            }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <div className="mb-4">
              <label htmlFor="name" className="block font-bold mb-2 italic">
                Metodos
              </label>
              <input
                  ref={inputRef}
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={editingUser.name}
                  className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  onClick={(e) => e.target.select()}
                  onFocus={(e) => e.target.select()}
                />
            </div>
            <div className="mb-4">
              <label htmlFor="activo" className="block font-bold mb-2">
                Activo
              </label>
              <input
                type="text"
                id="activo"
                name="activo"
                defaultValue={editingUser.activo || ''}
                className="border border-gray-300 p-2 w-full rounded"
                onClick={(e) => e.target.select()}
                  onFocus={(e) => e.target.select()}
              />
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
                onClick={() => setEditingUser(null)}
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
              onClick={() => setShowAddUserForm(true)}
              className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 ml-2"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
         </div>

          <div className="grid grid-cols-1 h-[1000]">
            {/* Columna de la tabla con scroll */}
            <div className="overflow-x-auto overflow-y-auto shadow-lg rounded-lg border border-gray-200">
              <table className="w-full min-w-[800px]">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="p-2 text-sm border-b">ID</th>
                    <th className="p-2 text-sm border-b">Metodo</th>
                    <th className="p-2 text-sm border-b">Activo</th>
                    <th className="p-2 text-sm border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableBody()}
                </tbody>
              </table>
            </div> 
           
           
         </div>
         {renderPagination()}

          
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">¿Estás seguro de que deseas eliminar este metodo?</p>
            <div className="flex justify-end">
              <button
                onClick={() => deleteUser(userToDelete)}
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

   
    </div>
  );
}