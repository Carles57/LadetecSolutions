import React, { useState, useEffect } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios
  const [loading, setLoading] = useState(true); // Estado para manejar el loading
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para obtener los usuarios
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/links/get_all_users');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      console.log('Datos recibidos:', data); // Imprime los datos recibidos en la consola
      setUsers(data); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Si está cargando, muestra un mensaje
  if (loading) {
    return <div>Cargando los usuarios todos...</div>;
  }

  // Si hay un error, muestra el mensaje de error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si no hay usuarios, muestra un mensaje
  if (users.length === 0) {
    return <div>No se encontraron usuarios.</div>;
  }

  // Renderiza la tabla de usuarios
  return (
    <div>
      <h2>Lista de todos los usuarios</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de usuario</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}