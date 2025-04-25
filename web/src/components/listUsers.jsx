import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:3000'; 
//const API_URL = process.env.REACT_APP_API_URL;

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', fullname: '', password: '', confirmPassword: '', role_id: '' });
  const [addUserError, setAddUserError] = useState('');
  const [roles, setRoles] = useState([]); // Estado para almacenar los roles

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/links/Users`);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
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
  };

  const fetchUserDetails = async (user) => {
    try {
      const response = await fetch(`${API_URL}/links/getUser/${user.id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles del usuario');
      }
      const data = await response.json();
      setSelectedUser(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateUser = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/links/update_user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
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
    const filtered = users.filter((user) => user.username.toLowerCase().includes(value));
    setFilteredUsers(filtered);
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
          username: newUser.username,
          fullname: newUser.fullname,
          password: newUser.password,
          role_id: newUser.role_id, // Incluye el role_id en la solicitud
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

      
      setNewUser({ username: '', fullname: '', password: '', confirmPassword: '', role_id: '' });
      setAddUserError('');
    } catch (error) {
      setAddUserError(error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles(); // Obtener roles al cargar el componente
  }, []);

  // Mostrar el formulario de creación automáticamente si no hay usuarios
  useEffect(() => {
    if (users.length === 0 && !showAddUserForm) {
      //setShowAddUserForm(true);
    }
  }, [users, showAddUserForm]);

  if (loading) {
    return <div>Cargando los usuarios...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de usuarios</h2>

      {selectedUser ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Detalles del usuario</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Nombre completo</td>
                  <td className="border border-gray-300 p-2 w-3/4">{selectedUser.fullname}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Dirección</td>
                  <td className="border border-gray-300 p-2 w-3/4">{selectedUser.direccion}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Nombre de usuario</td>
                  <td className="border border-gray-300 p-2 w-3/4">{selectedUser.username}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-bold w-1/4">Email</td>
                  <td className="border border-gray-300 p-2 w-3/4">{selectedUser.email}</td>
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
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Editar usuario</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUser(editingUser.id, {
                username: e.target.username.value,
                fullname: e.target.fullname.value,
              });
            }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <div className="mb-4">
              <label htmlFor="username" className="block font-bold mb-2">
                Nombre de usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue={editingUser.username}
                className="border border-gray-300 p-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fullname" className="block font-bold mb-2">
                Fullname
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                defaultValue={editingUser.fullname || ''}
                className="border border-gray-300 p-2 w-full rounded"
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
          <div className="mb-4 flex justify-between">
            <input
              type="text"
              placeholder="Filtrar por nombre de usuario"
              value={filter}
              onChange={handleFilterChange}
              className="border border-gray-300 p-2 w-full rounded"
            />
            <button
              onClick={() => setShowAddUserForm(true)}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ml-2"
            >
              <FontAwesomeIcon icon={faPlus} /> Agregar usuario
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-sm w-1/12">ID</th>
                  <th className="border border-gray-300 p-2 text-sm w-6/12">Nombre de usuario</th>
                  <th className="border border-gray-300 p-2 text-sm w-5/12">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-center">{user.id}</td>
                    <td className="border border-gray-300 p-2">{user.username}</td>
                    <td className="border border-gray-300 p-2 text-center flex justify-center items-center">
                      <button
                        onClick={() => fetchUserDetails(user)}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-2"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setSelectedUser(null);
                        }}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mr-2"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(user.id);
                          setShowDeleteConfirm(true);
                        }}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <h2 className="text-2xl font-bold mb-4 text-center">Agregar usuario</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="username" className="block font-bold mb-2">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>
              <div>
                <label htmlFor="fullname" className="block font-bold mb-2">
                  Fullname
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={newUser.fullname}
                  onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
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
                  Agregar usuario
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