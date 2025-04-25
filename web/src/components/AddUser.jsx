import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:3000'; // Define la URL base aquí

export default function UserNew() {
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
      const response = await fetch(`${API_URL}/links/get_all_users`);
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
      const response = await fetch(`${API_URL}/links/get_all_roles`); // Endpoint para obtener roles
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
      const response = await fetch(`${API_URL}/links/get_json/${user.id}`);
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
    setShowAddUserForm(true);
   
  }, [users, showAddUserForm]);

  if (loading) {
    return <div>Cargando los usuarios...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
     

      <div className="p-4 flex">    

      {showAddUserForm && (
        <div className="fixed inset-0 bg-gray  flex justify-center items-center">
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
    </div>
  );
}