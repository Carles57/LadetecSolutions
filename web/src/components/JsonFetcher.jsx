import { useState, useEffect } from 'react';

export default function JsonFetcher({ id }) {
  const [jsonData, setJsonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3000/links/get_json/${id}`);
        if (!response.ok) {
          throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        const data = await response.json();
        setJsonData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]); // El efecto se ejecuta cada vez que cambia `id`

  return (
    <div>
      {isLoading ? (
        <p>Cargando datos de Json Fetcher...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : jsonData ? (
        <div>
          <h2>Datos obtenidos:</h2>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      ) : (
        <p>No se encontraron datos.</p>
      )}
    </div>
  );
}