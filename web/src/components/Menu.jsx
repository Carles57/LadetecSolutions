import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import HeaderLink from './HeaderLink.astro';
import { SITE_TITLE } from '../consts';

// Estructura de datos para las opciones del menú
export default function Menu() {
const menuOptions = {
  admin: [
    { label: 'Home', href: '/' },
    { label: 'AllUsers', href: '/AllUsers' },
    { label: 'Ventas', href: '/Ventas' },
    { label: 'Economico', href: '/Economico' },
  ],
  economico: [
    { label: 'Home', href: '/' },
    { label: 'Economico', href: '/Economico' },
  ],
  ventas: [
    { label: 'Home', href: '/' },
    { label: 'Ventas', href: '/Ventas' },
  ],
  default: [
    { label: 'Home', href: '/' },
    { label: 'Login', href: '/getLogin' },
  ],
};

const Menu = () => {
  const { userRole } = useContext(UserContext);

  // Determinar las opciones del menú según el rol del usuario
  const options = menuOptions[userRole] || menuOptions.default;

  return (
    <header>
      <nav>
        <h2><a href="/">{SITE_TITLE}</a></h2>
        <div className="internal-links">
          {/* Renderizar las opciones del menú dinámicamente */}
          {options.map((option, index) => (
            <HeaderLink key={index} href={option.href}>
              {option.label}
            </HeaderLink>
          ))}
        </div>
        <div className="social-links">
          {/* Social links */}
        </div>
      </nav>
    </header>
  );
};
}