async function fetchJson(endpoint) {
    try {
      const response = await fetch(endpoint);
  
      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error al obtener datos: ${response.statusText}`);
      }
  
      // Parsea la respuesta como JSON
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error('Error de red:', error);
      return null;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const button = event.target;
      const filename = button.value;
      const file = button.innerHTML;
  
      alert('¡El botón ha sido clickeado!');
      alert(file);
  
      // Llama a la función fetchJson para obtener el JSON
      const jsonData = await fetchJson(`http://127.0.0.1:3000/links/obtener_json/${file}`);
  
      if (jsonData) {
        console.log('Datos obtenidos:', jsonData);
        // Aquí puedes hacer algo con el JSON, como mostrarlo en la página
      } else {
        console.error('No se pudo obtener el JSON');
      }
    });
  });