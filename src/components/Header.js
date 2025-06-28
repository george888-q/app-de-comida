import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, Settings, Percent, HelpCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAccessibility } from '../contexts/AccessibilityContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { getCartItemCount } = useCart();
  const { speak, voiceAssistant, toggleVoiceAssistant } = useAccessibility();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      speak(`Buscando: ${searchQuery}`);
      // Aquí se implementaría la búsqueda real
      console.log('Buscando:', searchQuery);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    speak(isMenuOpen ? 'Menú cerrado' : 'Menú abierto');
  };

  const navigationItems = [
    { path: '/', label: 'Inicio', ariaLabel: 'Ir a la página de inicio' },
    { path: '/restaurants', label: 'Restaurantes', ariaLabel: 'Ver todos los restaurantes' },
    { path: '/promotions', label: 'Promociones', ariaLabel: 'Ver promociones y ofertas especiales' },
    { path: '/cart', label: 'Mi Pedido', ariaLabel: 'Ver mi carrito de compras' },
    { path: '/orders', label: 'Historial de Pedidos', ariaLabel: 'Ver mi historial de pedidos' },
    { path: '/profile', label: 'Mi Cuenta', ariaLabel: 'Gestionar mi perfil y métodos de pago' },
    { path: '/faq', label: 'Ayuda', ariaLabel: 'Obtener ayuda y soporte' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={() => speak('Página de inicio')}
            aria-label="Ir a la página de inicio"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🍽️</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ComidaAccesible</span>
          </Link>

          {/* Barra de búsqueda - Solo visible en pantallas medianas y grandes */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar restaurantes o comida..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Buscar restaurantes o comida"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1.5 bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Buscar"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Navegación principal */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Navegación principal">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-lg font-medium transition-colors ${
                  location.pathname === item.path || (item.path === '/restaurants' && location.pathname.startsWith('/restaurant')) || (item.path === '/cart' && (location.pathname === '/checkout' || location.pathname.startsWith('/order')))
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                aria-label={item.ariaLabel}
                onClick={() => speak(`Navegando a ${item.label}`)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-4">
            {/* Botón de asistente de voz */}
            <button
              onClick={toggleVoiceAssistant}
              className={`p-2 rounded-lg transition-colors ${
                voiceAssistant
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={voiceAssistant ? 'Desactivar asistente de voz' : 'Activar asistente de voz'}
              title={voiceAssistant ? 'Asistente de voz activado' : 'Asistente de voz desactivado'}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {voiceAssistant ? '🎤' : '🔇'}
              </div>
            </button>

            {/* Carrito */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label={`Ver carrito de compras. ${getCartItemCount()} items`}
              onClick={() => speak(`Carrito con ${getCartItemCount()} productos`)}
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            {/* Botón de menú móvil */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Abrir menú de navegación"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda móvil */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar restaurantes o comida..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Buscar restaurantes o comida"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1.5 bg-blue-600 text-white p-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200" role="navigation" aria-label="Menú móvil">
            <div className="pt-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-lg font-medium transition-colors ${
                    location.pathname === item.path || (item.path === '/restaurants' && location.pathname.startsWith('/restaurant')) || (item.path === '/cart' && (location.pathname === '/checkout' || location.pathname.startsWith('/order')))
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  aria-label={item.ariaLabel}
                  onClick={() => {
                    speak(`Navegando a ${item.label}`);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 