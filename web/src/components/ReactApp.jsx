import React from 'react';

import Container from"./Container.astro";
import UserLogin from './n_newLogin.jsx';


const ReactApp = () => {
  return (
    <div>
    
      <UserLogin /> {/* Componente para manejar el login */}
     
      {/* Otros componentes de tu aplicación */}
    </div>
  );
};

export default ReactApp;