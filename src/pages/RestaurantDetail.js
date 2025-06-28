import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Truck, MapPin, Phone, Plus, Minus, ShoppingCart, Info, AlertTriangle, X } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useCart } from '../contexts/CartContext';
import { restaurants, products } from '../data/mockData';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductDetails, setShowProductDetails] = useState(null);
  const { speak, vibrate } = useAccessibility();
  const { addToCart } = useCart();

  const restaurant = restaurants.find(r => String(r.id) === String(id));
  const restaurantProducts = products[id] || [];

  // Reiniciar estados internos al cambiar de restaurante
  useEffect(() => {
    setSelectedCategory('');
    setShowProductDetails(null);
  }, [id]);

  useEffect(() => {
    if (restaurant) {
      speak(`Restaurante ${restaurant.name}. ${restaurant.description}. Tiempo de entrega: ${restaurant.deliveryTime}. Calificación: ${restaurant.rating} estrellas`);
    }
  }, [restaurant, speak]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurante no encontrado</h1>
          <Link to="/restaurants" className="btn btn-primary">
            Volver a Restaurantes
          </Link>
        </div>
      </div>
    );
  }

  // Obtener categorías únicas de productos
  const categories = [...new Set(restaurantProducts.map(product => product.category))];
  
  // Filtrar productos por categoría
  const filteredProducts = selectedCategory 
    ? restaurantProducts.filter(product => product.category === selectedCategory)
    : restaurantProducts;

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    speak(`Mostrando productos de la categoría: ${category}`);
  };

  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product, quantity);
    speak(`${product.name} agregado al carrito.`);
    vibrate(100);
  };

  const handleProductClick = (product) => {
    setShowProductDetails(product);
    speak(`${product.name}. ${product.description}. Precio: $${product.price} dólares. ${product.ingredients.join(', ')}`);
  };

  const readProductInfo = (product) => {
    const info = [
      `Producto: ${product.name}`,
      `Descripción: ${product.description}`,
      `Precio: $${product.price} dólares`,
      `Ingredientes: ${product.ingredients.join(', ')}`,
      product.allergens.length > 0 ? `Alérgenos: ${product.allergens.join(', ')}` : 'Sin alérgenos conocidos',
      `Calorías: ${product.nutritionalInfo.calories}`,
      `Proteínas: ${product.nutritionalInfo.protein}g`,
      `Carbohidratos: ${product.nutritionalInfo.carbs}g`,
      `Grasas: ${product.nutritionalInfo.fat}g`,
      product.isVegetarian ? 'Apto para vegetarianos' : 'No es vegetariano',
      product.isVegan ? 'Apto para veganos' : 'No es vegano',
      product.spiceLevel > 0 ? `Nivel de picante: ${product.spiceLevel}/3` : 'No picante'
    ].join('. ');
    
    speak(info);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del restaurante */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/restaurants"
              className="btn btn-secondary flex items-center space-x-2"
              onClick={() => speak('Volviendo a restaurantes')}
              aria-label="Volver a la lista de restaurantes"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Imagen del restaurante */}
            <div className="md:col-span-1">
              <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={`Imagen de ${restaurant.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-semibold text-gray-900">{restaurant.rating}</span>
                </div>
              </div>
            </div>

            {/* Información del restaurante */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{restaurant.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{restaurant.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <span>Tiempo de entrega: {restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Truck className="h-5 w-5" />
                    <span>Costo de entrega: $${restaurant.deliveryFee}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-5 w-5" />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-5 w-5" />
                    <span>{restaurant.phone}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Categorías</h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.categories.map((category) => (
                        <span
                          key={category}
                          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {restaurant.allergens.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Alérgenos
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {restaurant.allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menú */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros de categoría */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Menú</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label="Mostrar todos los productos"
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                aria-label={`Mostrar productos de ${category}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={`Imagen de ${product.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                  <span className="font-semibold text-gray-900">${product.price}</span>
                </div>
                {product.spiceLevel > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {Array(product.spiceLevel).fill('🌶️').join('')}
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                  <button
                    onClick={() => readProductInfo(product)}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    aria-label={`Leer información detallada de ${product.name}`}
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary flex items-center space-x-2"
                    aria-label={`Agregar ${product.name} al carrito`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no hay productos */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay productos en esta categoría
            </h3>
            <p className="text-gray-600">
              Intenta seleccionar otra categoría o ver todos los productos
            </p>
          </div>
        )}
      </div>

      {/* Modal de detalles del producto */}
      {showProductDetails && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
            role="document"
          >
            <button
              onClick={() => {
                setShowProductDetails(null);
                speak('Cerrando detalles del producto');
              }}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Cerrar detalles del producto"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 id="product-detail-title" className="text-2xl font-bold text-gray-900 mb-4">{showProductDetails.name}</h2>
            <p className="text-gray-700 mb-4">{showProductDetails.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Precio:</h3>
                <p className="text-lg text-gray-700">${showProductDetails.price.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Categoría:</h3>
                <p className="text-gray-700">{showProductDetails.category}</p>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">Ingredientes:</h3>
            <p className="text-gray-700 mb-4">{showProductDetails.ingredients.join(', ')}</p>

            {showProductDetails.allergens.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-red-700 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Alérgenos:
                </h3>
                <p className="text-red-700">{showProductDetails.allergens.join(', ')}</p>
              </div>
            )}

            <h3 className="font-semibold text-gray-900 mb-2">Información Nutricional:</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Calorías: {showProductDetails.nutritionalInfo.calories}</li>
              <li>Proteínas: {showProductDetails.nutritionalInfo.protein}g</li>
              <li>Carbohidratos: {showProductDetails.nutritionalInfo.carbs}g</li>
              <li>Grasas: {showProductDetails.nutritionalInfo.fat}g</li>
            </ul>

            <div className="flex items-center space-x-4 mb-6">
              {showProductDetails.isVegetarian && (
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Vegetariano
                </span>
              )}
              {showProductDetails.isVegan && (
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Vegano
                </span>
              )}
              {showProductDetails.spiceLevel > 0 && (
                <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                  Picante: {Array(showProductDetails.spiceLevel).fill('🌶️').join('')}
                </span>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  handleAddToCart(showProductDetails);
                  setShowProductDetails(null);
                }}
                className="btn btn-primary flex items-center space-x-2"
                aria-label={`Agregar ${showProductDetails.name} al carrito desde detalles`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Agregar al Carrito</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail; 