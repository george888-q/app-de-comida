import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, Truck, MapPin, Phone } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { restaurants, cuisines, categories } from '../data/mockData';

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const { speak } = useAccessibility();

  useEffect(() => {
    speak('Página de restaurantes. Usa los filtros para encontrar el restaurante perfecto.');
  }, [speak]);

  // Filtrar restaurantes
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = !selectedCuisine || restaurant.cuisine === selectedCuisine;
    const matchesCategory = !selectedCategory || restaurant.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCuisine && matchesCategory;
  });

  // Ordenar restaurantes
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'deliveryTime':
        return parseInt(a.deliveryTime.split('-')[0]) - parseInt(b.deliveryTime.split('-')[0]);
      case 'deliveryFee':
        return a.deliveryFee - b.deliveryFee;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleRestaurantClick = (restaurant) => {
    speak(`Navegando a ${restaurant.name}. ${restaurant.description}. Tiempo de entrega: ${restaurant.deliveryTime}. Calificación: ${restaurant.rating} estrellas`);
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'cuisine':
        setSelectedCuisine(value);
        speak(`Filtro de cocina cambiado a: ${value || 'todas'}`);
        break;
      case 'category':
        setSelectedCategory(value);
        speak(`Filtro de categoría cambiado a: ${value || 'todas'}`);
        break;
      case 'sort':
        setSortBy(value);
        speak(`Orden cambiado a: ${value}`);
        break;
      default:
        break;
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('');
    setSelectedCategory('');
    setSortBy('rating');
    speak('Filtros limpiados');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Restaurantes
          </h1>
          <p className="text-lg text-gray-600">
            Encuentra el restaurante perfecto con menús accesibles y deliciosos
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Búsqueda */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar restaurantes o tipos de comida..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                aria-label="Buscar restaurantes o tipos de comida"
              />
            </div>
          </div>

          {/* Botón de filtros móvil */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors"
              aria-label="Mostrar filtros"
              aria-expanded={showFilters}
            >
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </button>
          </div>

          {/* Filtros */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filtro de cocina */}
              <div>
                <label htmlFor="cuisine-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Cocina
                </label>
                <select
                  id="cuisine-filter"
                  value={selectedCuisine}
                  onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Seleccionar tipo de cocina"
                >
                  <option value="">Todas las cocinas</option>
                  {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>

              {/* Filtro de categoría */}
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Seleccionar categoría"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Ordenar por */}
              <div>
                <label htmlFor="sort-filter" className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  id="sort-filter"
                  value={sortBy}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Seleccionar orden"
                >
                  <option value="rating">Mejor calificación</option>
                  <option value="deliveryTime">Tiempo de entrega</option>
                  <option value="deliveryFee">Costo de entrega</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>

              {/* Botón limpiar filtros */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  aria-label="Limpiar todos los filtros"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <p className="text-gray-600">
            {sortedRestaurants.length === 0 ? (
              'No se encontraron restaurantes con los filtros seleccionados.'
            ) : (
              `Mostrando ${sortedRestaurants.length} restaurante${sortedRestaurants.length !== 1 ? 's' : ''}`
            )}
          </p>
        </div>

        {/* Lista de restaurantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.id}`}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              onClick={() => handleRestaurantClick(restaurant)}
              aria-label={`Ver menú de ${restaurant.name}. ${restaurant.description}. Tiempo de entrega: ${restaurant.deliveryTime}. Calificación: ${restaurant.rating} estrellas. Costo de entrega: ${restaurant.deliveryFee} dólares`}
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
                {!restaurant.isOpen && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">Cerrado</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {restaurant.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    <span>{restaurant.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="h-4 w-4" />
                    <span>${restaurant.deliveryFee}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {restaurant.cuisine}
                  </span>
                  {restaurant.categories.slice(0, 2).map((category) => (
                    <span
                      key={category}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {sortedRestaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron restaurantes
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar los filtros o buscar con términos diferentes
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
              aria-label="Limpiar filtros y mostrar todos los restaurantes"
            >
              Ver Todos los Restaurantes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants; 