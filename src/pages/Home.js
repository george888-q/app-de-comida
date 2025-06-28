import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Truck, Accessibility, Mic, Eye, Keyboard } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { restaurants } from '../data/mockData';

const Home = () => {
  const { speak } = useAccessibility();

  useEffect(() => {
    speak('Bienvenido a ComidaAccesible. La primera aplicación de comida diseñada para personas con discapacidad visual y daltonismo.');
  }, [speak]);

  const handleRestaurantClick = (restaurant) => {
    speak(`Navegando a ${restaurant.name}`);
  };

  const features = [
    {
      icon: <Mic className="h-8 w-8" />,
      title: 'Asistente de Voz',
      description: 'Navega y ordena usando comandos de voz naturales como "buscar pizza" o "agregar al carrito"',
      color: 'bg-blue-500',
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: 'Modos de Color',
      description: 'Soporte completo para deuteranopia, protanopia, tritanopia y alto contraste',
      color: 'bg-green-500',
    },
    {
      icon: <Keyboard className="h-8 w-8" />,
      title: 'Navegación por Teclado',
      description: 'Navegación completa usando solo el teclado con indicadores de foco claros',
      color: 'bg-purple-500',
    },
    {
      icon: <Accessibility className="h-8 w-8" />,
      title: 'Lectores de Pantalla',
      description: 'Compatible con todos los lectores de pantalla con etiquetas ARIA completas',
      color: 'bg-orange-500',
    },
  ];

  const highlightedRestaurants = restaurants.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Comida Accesible para Todos
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              La primera aplicación de comida diseñada específicamente para personas con 
              discapacidad visual y daltonismo. Navega, ordena y disfruta sin barreras.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/restaurants"
                className="btn btn-accent text-lg px-8 py-4 flex items-center justify-center space-x-2"
                onClick={() => speak('Explorando restaurantes')}
                aria-label="Ver todos los restaurantes disponibles"
              >
                <span>Explorar Restaurantes</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <button
                onClick={() => speak('Características de accesibilidad: Asistente de voz, modos de color para daltonismo, navegación por teclado y compatibilidad con lectores de pantalla')}
                className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
                aria-label="Escuchar características de accesibilidad"
              >
                Escuchar Características
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Características de Accesibilidad */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Características de Accesibilidad
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diseñada desde cero para ser completamente accesible y usable por todos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                onClick={() => speak(`${feature.title}: ${feature.description}`)}
                role="button"
                tabIndex={0}
                aria-label={`${feature.title}: ${feature.description}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    speak(`${feature.title}: ${feature.description}`);
                  }
                }}
              >
                <div className={`${feature.color} text-white rounded-lg p-3 w-fit mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurantes Destacados */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Restaurantes Destacados
            </h2>
            <p className="text-xl text-gray-600">
              Descubre los mejores restaurantes con menús accesibles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlightedRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                onClick={() => handleRestaurantClick(restaurant)}
                aria-label={`Ver menú de ${restaurant.name}. ${restaurant.description}. Tiempo de entrega: ${restaurant.deliveryTime}. Calificación: ${restaurant.rating} estrellas`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={`Imagen de ${restaurant.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">{restaurant.rating}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {restaurant.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="h-4 w-4" />
                      <span>€{restaurant.deliveryFee}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {restaurant.categories.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/restaurants"
              className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 mx-auto w-fit"
              onClick={() => speak('Ver todos los restaurantes')}
              aria-label="Ver todos los restaurantes disponibles"
            >
              <span>Ver Todos los Restaurantes</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para Comenzar?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya disfrutan de una experiencia de comida 
            completamente accesible y sin barreras.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/restaurants"
              className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              onClick={() => speak('Comenzando a explorar restaurantes')}
              aria-label="Comenzar a explorar restaurantes"
            >
              Comenzar Ahora
            </Link>
            <button
              onClick={() => speak('Para activar el asistente de voz, busca el botón con el ícono de micrófono en la parte superior derecha de la pantalla')}
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
              aria-label="Escuchar instrucciones del asistente de voz"
            >
              Activar Asistente de Voz
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 