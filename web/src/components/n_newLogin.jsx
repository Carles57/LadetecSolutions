import { useState } from 'react';

const API_URL = 'http://localhost:3000'; // URL base del servidor de Node.js
//const API_URL = 'http://localhost:3000'; // IP del servidor
//const API_URL = process.env.REACT_APP_API_URL;

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // ¡Importante para cookies!
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setMessage(data.message);
        setError('');

        // Redirigir al módulo correspondiente según la ruta devuelta por el backend
        if (data.user && data.user.module_route) {
          window.location.href = data.user.module_route;
        } else {
          setError('No tienes permisos para acceder a ningún módulo desde n_newLogin.');
        }
      } else {
        setError(data.error);
        setMessage('');
      }
    } catch (err) {
      setError('Error al conectarse al servidor, aqui, en n_newLogin');
      setMessage('');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto  shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-500">Entre sus credenciales</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block font-bold mb-2">
            Nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}