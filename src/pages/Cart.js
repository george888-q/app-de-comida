import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, AlertCircle } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    address: '',
    phone: '',
    instructions: '',
  });
  const { speak, vibrate } = useAccessibility();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartItemCount 
  } = useCart();

  useEffect(() => {
    const total = getCartTotal();
    const itemCount = getCartItemCount();
    speak(`Carrito de compras. ${itemCount} productos. Total: $${total.toFixed(2)} dólares`);
  }, [cart, getCartTotal, getCartItemCount, speak]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      vibrate(100);
    } else {
      updateQuantity(productId, newQuantity);
      vibrate(50);
    }
  };

  const handleRemoveItem = (productId) => {
    const product = cart.find(item => item.id === productId);
    if (product) {
      speak(`${product.name} removido del carrito`);
      removeFromCart(productId);
      vibrate(100);
    }
  };

  const handleClearCart = () => {
    speak('Carrito vaciado');
    clearCart();
    vibrate([100, 50, 100]);
  };

  const handleInputChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckout = () => {
    const total = getCartTotal();
    speak(`Procediendo al checkout. Total: $${total.toFixed(2)} dólares`);
    vibrate(200);
    // Aquí se navegaría al checkout
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
            <p className="text-lg text-gray-600 mb-8">
              Parece que aún no has agregado ningún producto a tu carrito
            </p>
            <Link
              to="/restaurants"
              className="btn btn-primary text-lg px-8 py-4"
              onClick={() => speak('Navegando a restaurantes')}
              aria-label="Explorar restaurantes para agregar productos al carrito"
            >
              Explorar Restaurantes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const deliveryFee = 2.50; // Ejemplo fijo
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/restaurants"
            className="btn btn-secondary flex items-center space-x-2"
            onClick={() => speak('Volviendo a restaurantes')}
            aria-label="Volver a restaurantes"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Seguir Comprando</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Productos ({getCartItemCount()})
                </h2>
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                  aria-label="Vaciar carrito"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Vaciar Carrito</span>
                </button>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={`Imagen de ${item.name}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-lg font-bold text-gray-900">${item.price}</span>
                        
                        {/* Controles de cantidad */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                            aria-label={`Reducir cantidad de ${item.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                            aria-label={`Aumentar cantidad de ${item.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-gray-900 mb-2">
                        ${item.price * item.quantity}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        aria-label={`Remover ${item.name} del carrito`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Información de entrega */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Entrega</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={deliveryInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input"
                    required
                    aria-label="Ingresar nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={deliveryInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="input"
                    required
                    aria-label="Ingresar número de teléfono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de Entrega *
                  </label>
                  <textarea
                    id="address"
                    value={deliveryInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="input resize-none"
                    rows="3"
                    required
                    aria-label="Ingresar dirección de entrega"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                    Instrucciones Especiales (Opcional)
                  </label>
                  <textarea
                    id="instructions"
                    value={deliveryInfo.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    className="input resize-none"
                    rows="2"
                    placeholder="Ej: Llamar antes de llegar, código de acceso, etc."
                    aria-label="Ingresar instrucciones especiales para la entrega"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-2 text-gray-700 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Costo de Envío:</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn btn-primary w-full py-3 text-lg flex items-center justify-center space-x-2"
                onClick={handleCheckout}
                aria-label={`Proceder al pago. Total a pagar: $${total.toFixed(2)} dólares`}
              >
                <ShoppingCart className="h-6 w-6" />
                <span>Proceder al Pago</span>
              </Link>

              <p className="text-sm text-gray-500 mt-4 text-center">
                Al proceder al pago, aceptas nuestros <Link to="#" className="text-blue-600 hover:underline">Términos y Condiciones</Link>.
              </p>

              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md" role="note">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Nota de Accesibilidad:</h3>
                </div>
                <p className="text-sm">
                  Si necesitas ayuda para navegar, activa el asistente de voz en la parte superior de la pantalla 
                  o desde el panel de accesibilidad.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 