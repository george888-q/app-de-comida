import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useCart } from '../contexts/CartContext';
import { paymentMethods } from '../data/mockData';

const Checkout = () => {
  const { speak, vibrate } = useAccessibility();
  const { cart, getCartTotal, createOrder } = useCart();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      // Redirigir al carrito si está vacío
      window.location.href = '/cart';
      return;
    }
    
    const total = getCartTotal();
    speak(`Página de checkout. Total a pagar: $${total.toFixed(2)} dólares. Selecciona un método de pago`);
  }, [cart, getCartTotal, speak]);

  const handlePaymentMethodChange = (methodId) => {
    setSelectedPaymentMethod(methodId);
    const method = paymentMethods.find(m => m.id === methodId);
    speak(`Método de pago seleccionado: ${method?.name}`);
    vibrate(50);
  };

  const handleConfirmOrder = async () => {
    if (!selectedPaymentMethod) {
      speak('Por favor selecciona un método de pago');
      vibrate([200, 100, 200]);
      return;
    }

    setIsProcessing(true);
    speak('Procesando tu pedido...');
    vibrate([50, 50, 50]);

    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const deliveryInfo = {
        name: 'Usuario Ejemplo',
        address: 'Calle Ejemplo 123',
        phone: '+34 123 456 789',
        instructions: 'Sin instrucciones especiales',
      };

      const order = createOrder(deliveryInfo, selectedPaymentMethod);
      
      setIsProcessing(false);
      setOrderConfirmed(true);
      
      speak(`¡Pedido confirmado! Tu número de pedido es ${order.id}. Será entregado en aproximadamente 30 minutos.`);
      vibrate([100, 50, 100, 50, 200]);
      
      // Redirigir a la página de pedidos después de 3 segundos
      setTimeout(() => {
        window.location.href = '/orders';
      }, 3000);
      
    } catch (error) {
      setIsProcessing(false);
      speak('Error al procesar el pedido. Por favor intenta de nuevo.');
      vibrate([200, 100, 200, 100, 300]);
    }
  };

  const subtotal = getCartTotal();
  const deliveryFee = 2.50;
  const total = subtotal + deliveryFee;

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Pedido Confirmado!</h1>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido procesado exitosamente y será entregado pronto.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              Redirigiendo a la página de pedidos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/cart"
            className="btn btn-secondary flex items-center space-x-2"
            aria-label="Volver al carrito"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver al Carrito</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información de pago */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Método de Pago
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={() => handlePaymentMethodChange(method.id)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      aria-label={`Seleccionar ${method.name}`}
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Detalles de tarjeta (solo para tarjeta) */}
              {selectedPaymentMethod === 'card' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-800 text-sm">
                  Este es un método de pago simulado. No es necesario ingresar datos reales.
                </div>
              )}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">Cantidad: {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ${ (item.price * item.quantity).toFixed(2) }
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de confirmar pedido */}
            <button
              onClick={handleConfirmOrder}
              disabled={isProcessing || !selectedPaymentMethod}
              className="w-full btn btn-primary flex items-center justify-center space-x-2"
              aria-label="Confirmar pedido"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>Confirmar Pedido</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 