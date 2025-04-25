import React, { useState, useEffect } from 'react';

export default function UserList() {
  // Estado para almacenar la lista de usuarios
  const [users, setUsers] = useState([]);

  // Estado para almacenar el ID del usuario seleccionado
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Estado para almacenar la lista filtrada de usuarios
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Función para obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/links/get_all_users');
      const data = await response.json();
      setUsers(data); // Actualiza el estado con la lista de usuarios
      setFilteredUsers(data); // Inicialmente, muestra todos los usuarios
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Función para obtener un usuario específico por ID
  const fetchUserById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/links/get_json/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Manejar la selección de un usuario
  const handleUserSelect = async (id) => {
    setSelectedUserId(id); // Actualiza el estado del usuario seleccionado
    if (id) {
      const selectedUser = await fetchUserById(id);
      setFilteredUsers(selectedUser ? [selectedUser] : []); // Filtra la lista para mostrar solo el usuario seleccionado
    } else {
      setFilteredUsers(users); // Restaura la lista completa si no hay selección
    }
  };

  // Manejar el botón de limpiar filtro
  const handleClearFilter = () => {
    setSelectedUserId(null); // Limpia el usuario seleccionado
    setFilteredUsers(users); // Restaura la lista completa de usuarios
  };

  return (
    <div>
      <h2>Lista de usuarios</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>
                <button onClick={() => handleUserSelect(user.id)}>
                  Seleccionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón para limpiar el filtro */}
      {selectedUserId && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleClearFilter}>Limpiar filtro</button>
        </div>
      )}

      {/* Mostrar los detalles del usuario seleccionado */}
      {selectedUserId && filteredUsers.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Detalles del usuario seleccionado</h2>
          <pre>{JSON.stringify(filteredUsers[0], null, 2)}</pre>
        </div>
      )}
    </div>
  );
}