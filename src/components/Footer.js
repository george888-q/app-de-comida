import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Accessibility, Shield, Phone, Mail, User, CreditCard, Percent, HelpCircle, Mic, Headphones, LogOut } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

const Footer = () => {
  const { speak } = useAccessibility();

  const handleLinkClick = (text) => {
    speak(`Navegando a ${text}`);
  };

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🍽️</span>
              </div>
              <span className="text-xl font-bold">ComidaAccesible</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              La primera aplicación de comida diseñada específicamente para personas con discapacidad visual 
              y daltonismo. Nuestro compromiso es hacer que la experiencia de pedir comida sea accesible para todos.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Accessibility className="h-4 w-4" />
                <span>100% Accesible</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Seguro</span>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => handleLinkClick('página de inicio')}
                  aria-label="Ir a la página de inicio"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => handleLinkClick('restaurantes')}
                  aria-label="Ver todos los restaurantes"
                >
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link
                  to="/promotions"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => handleLinkClick('promociones')}
                  aria-label="Ver promociones y ofertas"
                >
                  Promociones
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => handleLinkClick('carrito de compras')}
                  aria-label="Ver carrito de compras"
                >
                  Carrito
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => handleLinkClick('mis pedidos')}
                  aria-label="Ver historial de pedidos"
                >
                  Mis Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Mi Cuenta */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Mi Cuenta</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                  onClick={() => handleLinkClick('mi perfil')}
                  aria-label="Ir a mi perfil"
                >
                  <User className="h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/payment-methods"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                  onClick={() => handleLinkClick('métodos de pago')}
                  aria-label="Gestionar métodos de pago"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Métodos de Pago</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLinkClick('cerrar sesión');
                    alert('Simulación: Sesión cerrada'); // Simular cierre de sesión
                  }}
                  className="text-gray-300 hover:text-white transition-colors text-left w-full flex items-center space-x-2"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" /> {/* Assuming LogOut icon exists or using a generic one */}
                  <span>Cerrar Sesión</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                  onClick={() => handleLinkClick('preguntas frecuentes')}
                  aria-label="Ver preguntas frecuentes"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Preguntas Frecuentes</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/voice-support"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                  onClick={() => handleLinkClick('soporte por voz')}
                  aria-label="Obtener soporte por voz"
                >
                  <Mic className="h-4 w-4" />
                  <span>Soporte por Voz</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/audio-tutorial"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                  onClick={() => handleLinkClick('tutorial por audio')}
                  aria-label="Ver tutorial por audio"
                >
                  <Headphones className="h-4 w-4" />
                  <span>Tutorial por Audio</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Características de accesibilidad */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-center">Características de Accesibilidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">🎤</span>
              </div>
              <h4 className="font-semibold mb-2">Asistente de Voz</h4>
              <p className="text-gray-300 text-sm">
                Navega y ordena usando comandos de voz naturales
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">👁️</span>
              </div>
              <h4 className="font-semibold mb-2">Modos de Color</h4>
              <p className="text-gray-300 text-sm">
                Soporte para deuteranopia, protanopia y tritanopia
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">⌨️</span>
              </div>
              <h4 className="font-semibold mb-2">Navegación por Teclado</h4>
              <p className="text-gray-300 text-sm">
                Navegación completa usando solo el teclado
              </p>
            </div>
          </div>
        </div>

        {/* Información legal y accesibilidad */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>© 2024 ComidaAccesible. Todos los derechos reservados.</span>
              <span>•</span>
              <span>Conformidad WCAG 2.1 AA</span>
              <span>•</span>
              <span>Hecho con <Heart className="h-4 w-4 inline text-red-500" /> para todos</span>
            </div>
            <div className="flex space-x-4 text-sm">
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => handleLinkClick('política de privacidad')}
                aria-label="Ver política de privacidad"
              >
                Privacidad
              </button>
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => handleLinkClick('términos de servicio')}
                aria-label="Ver términos de servicio"
              >
                Términos
              </button>
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => handleLinkClick('declaración de accesibilidad')}
                aria-label="Ver declaración de accesibilidad"
              >
                Accesibilidad
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional para lectores de pantalla */}
        <div className="sr-only">
          <p>
            Esta aplicación está diseñada para ser completamente accesible. 
            Incluye soporte para lectores de pantalla, navegación por teclado, 
            y modos de color para personas con daltonismo. 
            Para activar el asistente de voz, busca el botón con el ícono de micrófono en la parte superior derecha.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 