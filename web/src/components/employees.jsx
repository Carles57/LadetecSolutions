import React, { useState, useEffect, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faUsers, faClock  } from '@fortawesome/free-solid-svg-icons';


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
  const [newUser, setNewUser] = useState({ name: '', work_email: '', work_phone: '', tasa: '' });
  const [addUserError, setAddUserError] = useState('');
  const [roles, setRoles] = useState([]); // Estado para almacenar los roles

  const inputRef = useRef(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Calcular datos paginados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [analyticData, setAnalyticData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

// Función para formatear la fecha
const formatLocalDate = (dateString) => {
  return new Date(dateString).toISOString().split('T')[0];
};

const fetchAnalyticTime = async (employeeId) => {
    try {
      const formattedDate = formatLocalDate(selectedDate);
      const response = await fetch(
        `${API_URL}/links/analytic_time/${employeeId}/${formattedDate}`
      );
      
      if (!response.ok) throw new Error('Error al obtener datos analíticos');
      
      const data = await response.json();
      setAnalyticData(data);
      setShowAnalytics(true);
    } catch (error) {
      setError(error.message);
    }
  };

  // Cambiar página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Selector de items por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Resetear a la primera página al cambiar el tamaño
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
            
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
            
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

  useEffect(() => {
    if (editingUser && inputRef.current) {
      inputRef.current.select();
    }
  }, [editingUser]);

  useEffect(() => {
    const filtered = users.filter((user) => 
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredData(filtered);
  }, [users, filter]); // Se ejecuta cuando cambian users o filter

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/links/employee`);
      if (!response.ok) {
        throw new Error('Error al obtener a los empleados');
      }
      const data = await response.json();


      const processedData = data.map(item => ({
                id: item.id,
                name: item.name,
                work_email: item.work_email, // Usar valor directo del string
                work_phone: item.work_phone || 0,
                tasa: item.tasa 
            
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

  /*const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/links/roles`); 
      if (!response.ok) {
        throw new Error('Error al obtener los roles');
      }
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      setError(error.message);
    }
  };*/

  const fetchUserDetails = async (user) => {
    try {
      const response = await fetch(`${API_URL}/links/employee/${user.id}`);
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
      setIsUpdating(true);
      const response = await fetch(`${API_URL}/links/update_employee/${id}`, {
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
    finally {
      setIsUpdating(false);
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

  /*const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
    const filtered = users.filter((user) => user.name.toLowerCase().includes(value));
    setFilteredData(filtered);
  };*/

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmPassword) {
      setAddUserError('Las contraseñas no coinciden');
      return;
    }
    if (!newUser.role_id) {
      setAddUserError('Debes seleccionar un rol');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/links/create_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUser.name,
          work_email: newUser.work_email,
          work_phone: newUser.work_phone,
          tasa: newUser.tasa,
          
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

      
      setNewUser({ name: '', work_email: '', work_phone: '' , tasa: '' });
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
    return <div>Cargando a los empleados...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  return (
    <div className="p-2 max-w-6xl mx-auto"> 
      <h4 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">
      <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Listado de Empleados de Ladetec
      </span>
      <FontAwesomeIcon 
      icon={faUsers} 
      className="ml-3 text-blue-600 text-xl md:text-2xl align-middle"
    />
      </h4>

      {selectedUser ? (
        <div className="mt-2">
          <h2 className="text-2xl font-bold pt-2 mb-4 text-center">Detalles de los Empleados</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Nombre completo</td>
                  <td className="border border-gray-300 p-2 w-3/4">{selectedUser.name}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Email</td>
                  <td className="border border-gray-300 p-2 w-3/4">{selectedUser.work_email}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Phone</td>
                  <td className="border border-gray-300 p-2 w-3/4">{selectedUser.work_phone}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Tasa</td>
                  <td className="border border-gray-300 p-2 w-3/4">{selectedUser.tasa}</td>
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
          <h2 className="text-2xl font-bold mb-4 text-center">Editar usuario</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUser(editingUser.id, {
                name: e.target.name.value,
                work_email: e.target.work_email.value,
                work_phone: e.target.work_phone.value,
                tasa: e.target.tasa.value,
              });
            }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <div className="mb-4">
              <label htmlFor="name" className="block font-bold mb-2 italic">
                Usuarios
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
              <label htmlFor="work_email" className="block font-bold mb-2">
                Email
              </label>
              <input
                type="text"
                id="work_email"
                name="work_email"
                defaultValue={editingUser.work_email || ''}
                className="border border-gray-300 p-2 w-full rounded"
                onClick={(e) => e.target.select()}
                  onFocus={(e) => e.target.select()}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="work_phone" className="block font-bold mb-2">
                Phone
              </label>
              <input
                type="text"
                id="work_phone"
                name="work_phone"
                defaultValue={editingUser.work_phone || ''}
                className="border border-gray-300 p-2 w-full rounded"
                onClick={(e) => e.target.select()}
                  onFocus={(e) => e.target.select()}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="work_phone" className="block font-bold mb-2">
                Tasa
              </label>
              <input
                type="text"
                id="tasa"
                name="tasa"
                defaultValue={editingUser.tasa || 0}
                className="border border-gray-300 p-2 w-full rounded"
                onClick={(e) => e.target.select()}
                  onFocus={(e) => e.target.select()}
              />
            </div>



            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={isUpdating}
              >
               
                {isUpdating ? 'Guardando...' : 'Guardar cambios'}
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
       <div className="mb-4 flex justify-between italic gap-2">
           {/* Selector de fecha nuevo */}
           <input
             type="date"
             value={selectedDate}
             onChange={(e) => setSelectedDate(e.target.value)}
             className="border border-gray-300 p-2 rounded"
           />
           
           {/* Filtro existente por nombre */}
           <input
             type="text"
             placeholder="Filtrar por nombre..."
             value={filter}
             onChange={handleFilterChange}
             className="border border-gray-300 p-2 flex-grow rounded"
           />
           
           {/* Botón de agregar */}
           <button
             onClick={() => setShowAddUserForm(true)}
             className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
                    <th className="p-2 text-sm border-b">Nombre</th>
                    <th className="p-2 text-sm border-b">Email</th>
                    <th className="p-2 text-sm border-b">Telefono</th>
                    <th className="p-2 text-sm border-b">Tarifa</th>
                    <th className="p-2 text-sm border-b">Horas</th>
                    <th className="p-2 text-sm border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                {currentItems.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-1 text-center">{user.id}</td>
                    <td className="border border-gray-300 p-1">
                      <button 
                        onClick={() => fetchUserDetails(user)}
                        className="text-blue-600 hover:text-blue-800 underline text-sm truncate transition-colors"
                      >
                        {user.name}
                      </button>
                    </td>
                    <td className="border border-gray-300 p-1">
                      <button 
                        onClick={() => fetchUserDetails(user)}
                        className="text-blue-600 hover:text-blue-800 underline text-sm truncate transition-colors"
                      >
                        {user.work_email}
                      </button>
                    </td>

                    <td className="border border-gray-300 p-1">
                      <button 
                        onClick={() => fetchUserDetails(user)}
                        className="text-blue-600 hover:text-blue-800 underline text-sm truncate transition-colors"
                      >
                        {user.work_phone}
                      </button>
                    </td>

                    <td className="border border-gray-300 p-1">
                      <button 
                        onClick={() => fetchUserDetails(user)}
                        className="text-blue-600 hover:text-blue-800 underline text-sm truncate transition-colors"
                      >
                        {user.tasa}
                      </button>
                    </td>

                    <td className="border border-gray-300 p-1 text-center">
                        <button
                            onClick={() => fetchAnalyticTime(user.id)}
                            className="bg-purple-500 text-white p-1 rounded hover:bg-purple-600"
                        >
                            <FontAwesomeIcon icon={faClock} />
                        </button>
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
                ))}
              </tbody>
             </table>
            </div> 
           
           
         </div>
         {renderPagination()}

         {/* Después de {renderPagination()} */}
            {showAnalytics && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 italic">
                Horas de: <span className="text-blue-600 ml-2">{analyticData?.[0]?.Nombre || "Nombre no disponible"}</span>  
                <span className="text-black ml-2 italic">En fecha:</span> <span className="text-blue-600 ml-2 italic">- {selectedDate}</span>

                <button 
                    onClick={() => setShowAnalytics(false)}
                    className="ml-2 text-red-500 hover:text-red-700"
                >
                    ×
                </button>
                </h3>
                
                <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Tarea</th>
                        <th className="p-2 border">Proyecto</th>
                        <th className="p-2 border">Horas</th>
                       
                    </tr>
                    </thead>
                    <tbody>
                    {analyticData?.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            {/* Columna TAREA */}
                            <td className="p-2 border">
                            {entry.tarea || "."}
                            </td>
                              {/* Columna PROYECTO */}
                              <td className="p-2 border">
                            {entry.proyecto || "Proyecto no asignado"}
                            </td>

                            {/* Columna HORAS */}
                            <td className="p-2 border text-center">
                            {typeof entry.horas === 'number' 
                                ? `${entry.horas.toFixed(2)}h` 
                                : 'Dato inválido'}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                
                {!analyticData?.length && (
                    <div className="text-center py-4 text-gray-500">
                    No hay registros para esta fecha
                    </div>
                )}
                </div>
            </div>
            )}

          
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">¿Estás seguro de que deseas eliminar este usuario?</p>
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

      {showAddUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Agregar</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-bold mb-2">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>
              <div>
                <label htmlFor="work_email" className="block font-bold mb-2">
                  work_email
                </label>
                <input
                  type="text"
                  id="work_email"
                  name="work_email"
                  value={newUser.work_email}
                  onChange={(e) => setNewUser({ ...newUser, work_email: e.target.value })}
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>
              <div>
                <label htmlFor="password" className="block font-bold mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block font-bold mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>
              <div>
                <label htmlFor="role_id" className="block font-bold mb-2">
                  Rol
                </label>
                <select
                  id="role_id"
                  name="role_id"
                  value={newUser.role_id}
                  onChange={(e) => setNewUser({ ...newUser, role_id: e.target.value })}
                  className="border border-gray-300 p-2 w-full rounded"
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              {addUserError && <p className="text-red-500">{addUserError}</p>}
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}