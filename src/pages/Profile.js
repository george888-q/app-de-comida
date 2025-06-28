import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Edit, Save, CreditCard } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

const Profile = () => {
  const { speak, setColorMode, colorMode } = useAccessibility();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '+34 600 123 456',
    address: 'Calle Falsa 123, Ciudad, País',
  });

  useEffect(() => {
    speak('Página de perfil. Aquí puedes ver y editar tu información personal.');
  }, [speak]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    speak('Guardando cambios del perfil.');
    // Aquí se implementaría la lógica para guardar los datos en una DB real
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen app-container bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/"
            className="btn btn-secondary flex items-center space-x-2"
            onClick={() => speak('Volviendo a la página de inicio')}
            aria-label="Volver a la página de inicio"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Inicio</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        </div>

        <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                speak(isEditing ? 'Cancelando edición del perfil' : 'Editando perfil');
              }}
              className="btn btn-secondary flex items-center space-x-2"
              aria-label={isEditing ? 'Cancelar edición de perfil' : 'Editar información de perfil'}
            >
              {isEditing ? <Save className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
              <span>{isEditing ? 'Guardar Cambios' : 'Editar Perfil'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="input disabled:bg-gray-100 disabled:text-gray-600"
                aria-label="Nombre completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="input disabled:bg-gray-100 disabled:text-gray-600"
                aria-label="Email de contacto"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="input disabled:bg-gray-100 disabled:text-gray-600"
                aria-label="Número de teléfono"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección Principal
              </label>
              <textarea
                id="address"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="input disabled:bg-gray-100 disabled:text-gray-600 resize-none"
                rows="3"
                aria-label="Dirección principal de entrega"
              />
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  // Aquí podrías resetear los cambios si lo deseas
                  speak('Edición de perfil cancelada.');
                }}
                className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                aria-label="Cancelar cambios"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
                aria-label="Guardar cambios en el perfil"
              >
                Guardar
              </button>
            </div>
          )}
        </div>

        {/* Sección de Métodos de Pago - Enlace a página dedicada */}
        <div className="rounded-lg shadow-lg p-6 mt-8" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Métodos de Pago</h2>
          <p className="text-gray-600 mb-4">
            Gestiona tus tarjetas de crédito o débito y otras opciones de pago.
          </p>
          <Link
            to="/payment-methods"
            className="btn btn-secondary flex items-center justify-center space-x-2 w-full"
            onClick={() => speak('Navegando a métodos de pago')}
            aria-label="Ir a la página de métodos de pago"
          >
            <CreditCard className="h-5 w-5" />
            <span>Gestionar Métodos de Pago</span>
          </Link>
        </div>

        {/* Sección de Cerrar Sesión */}
        <div className="rounded-lg shadow-lg p-6 mt-8" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cerrar Sesión</h2>
          <p className="text-gray-600 mb-4">
            Cierra tu sesión actual de forma segura.
          </p>
          <button
            onClick={() => {
              speak('Cerrando sesión');
              alert('Simulación: Sesión cerrada'); // Simular cierre de sesión
              // Aquí se implementaría la lógica real de cierre de sesión (borrar tokens, etc.)
            }}
            className="btn bg-red-600 text-white hover:bg-red-700 w-full"
            aria-label="Cerrar sesión"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Sección de Configuración de Accesibilidad */}
        <div className="rounded-lg shadow-lg p-6 mt-8" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de Accesibilidad</h2>
          <p className="text-gray-600 mb-4">
            Cambia el modo de color para mejorar la accesibilidad visual según tus necesidades.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <button className={`btn ${colorMode === 'normal' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setColorMode('normal'); speak('Modo normal activado.'); }} aria-label="Modo Normal">Normal</button>
            <button className={`btn ${colorMode === 'deuteranopia' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setColorMode('deuteranopia'); speak('Modo deuteranopia activado.'); }} aria-label="Modo Deuteranopia">Deuteranopia</button>
            <button className={`btn ${colorMode === 'protanopia' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setColorMode('protanopia'); speak('Modo protanopia activado.'); }} aria-label="Modo Protanopia">Protanopia</button>
            <button className={`btn ${colorMode === 'tritanopia' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setColorMode('tritanopia'); speak('Modo tritanopia activado.'); }} aria-label="Modo Tritanopia">Tritanopia</button>
            <button className={`btn ${colorMode === 'high-contrast' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setColorMode('high-contrast'); speak('Modo alto contraste activado.'); }} aria-label="Modo Alto Contraste">Alto Contraste</button>
          </div>
          <p className="text-gray-500 text-sm">También puedes cambiar el modo usando comandos de voz como "Cambiar modo deuteranopia".</p>
        </div>

      </div>
    </div>
  );
};

export default Profile; 