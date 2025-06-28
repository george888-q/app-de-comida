import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Clock, CreditCard, Package, Truck, CheckCircle, Star } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useCart } from '../contexts/CartContext';
import { orderStatuses } from '../data/mockData';

const OrderDetail = () => {
  const { id } = useParams();
  const { speak } = useAccessibility();
  const { getOrderById } = useCart();

  const order = getOrderById(id);

  useEffect(() => {
    if (order) {
      speak(`Detalles del pedido ${order.id}. Estado: ${orderStatuses[order.status]?.label}. Total: $${order.total.toFixed(2)} dólares`);
    } else {
      speak('Pedido no encontrado');
    }
  }, [order, speak]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido no encontrado</h1>
          <Link to="/orders" className="btn btn-primary">
            Volver a Mis Pedidos
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'preparando':
        return 'Tu pedido está siendo preparado en el restaurante. Los chefs están trabajando para que tu comida esté perfecta.';
      case 'en_camino':
        return '¡Tu pedido está en camino! Un repartidor está llevando tu comida hacia tu dirección.';
      case 'entregado':
        return '¡Tu pedido ha sido entregado exitosamente! Esperamos que hayas disfrutado tu comida.';
      case 'cancelado':
        return 'Tu pedido ha sido cancelado. Si tienes alguna pregunta, contacta con nuestro soporte.';
      default:
        return 'Estado desconocido';
    }
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const estimated = new Date(order.estimatedDelivery);
    const diff = estimated - now;
    
    if (diff <= 0) {
      return 'Tiempo estimado expirado';
    }
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes} minutos`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/orders"
            className="btn btn-secondary flex items-center space-x-2"
            onClick={() => speak('Volviendo a mis pedidos')}
            aria-label="Volver a mis pedidos"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a Mis Pedidos</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Pedido #{order.id}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estado del pedido */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Estado del Pedido</h2>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  order.status === 'preparando' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'en_camino' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'entregado' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <span className="mr-2">{orderStatuses[order.status]?.icon}</span>
                  {orderStatuses[order.status]?.label}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                {getStatusDescription(order.status)}
              </p>

              {order.status !== 'entregado' && order.status !== 'cancelado' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">
                      Tiempo restante estimado: {getTimeRemaining()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Productos del pedido */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos del Pedido</h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={`Imagen de ${item.name}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-gray-600">Cantidad: {item.quantity}</span>
                        <span className="text-gray-600">Precio unitario: $${item.price}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total del Pedido</span>
                  <span>$ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Información de entrega */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Entrega</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Dirección de Entrega
                  </h3>
                  <div className="text-gray-600 space-y-1">
                    <p><strong>Nombre:</strong> {order.deliveryInfo.name}</p>
                    <p><strong>Dirección:</strong> {order.deliveryInfo.address}</p>
                    <p><strong>Teléfono:</strong> {order.deliveryInfo.phone}</p>
                    {order.deliveryInfo.instructions && (
                      <p><strong>Instrucciones:</strong> {order.deliveryInfo.instructions}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Información de Pago
                  </h3>
                  <div className="text-gray-600 space-y-1">
                    <p><strong>Método de pago:</strong> {order.paymentMethod}</p>
                    <p><strong>Fecha del pedido:</strong> {formatDate(order.createdAt)}</p>
                    <p><strong>Estimado de entrega:</strong> {formatDate(order.estimatedDelivery)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de progreso detallada */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Seguimiento del Pedido</h2>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      order.status === 'preparando' || order.status === 'en_camino' || order.status === 'entregado'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <Package className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-center">Preparando</span>
                    <span className="text-xs text-gray-500 text-center">En el restaurante</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      order.status === 'en_camino' || order.status === 'entregado'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <Truck className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-center">En Camino</span>
                    <span className="text-xs text-gray-500 text-center">Hacia tu dirección</span>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      order.status === 'entregado'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-center">Entregado</span>
                    <span className="text-xs text-gray-500 text-center">En tu puerta</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      order.status === 'preparando' ? 'bg-blue-600 w-1/3' :
                      order.status === 'en_camino' ? 'bg-blue-600 w-2/3' :
                      order.status === 'entregado' ? 'bg-green-600 w-full' :
                      'bg-gray-300 w-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Número de pedido</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Fecha</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Estado</span>
                  <span className="font-medium">{orderStatuses[order.status]?.label}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Total</span>
                  <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-6 space-y-3">
                {order.status === 'entregado' && (
                  <button
                    className="w-full btn btn-primary flex items-center justify-center space-x-2"
                    onClick={() => speak('Función de calificación no implementada en esta demo')}
                    aria-label="Calificar el pedido"
                  >
                    <Star className="h-4 w-4" />
                    <span>Calificar Pedido</span>
                  </button>
                )}
                
                <button
                  className="w-full btn btn-secondary"
                  onClick={() => speak('Función de repetir pedido no implementada en esta demo')}
                  aria-label="Repetir este pedido"
                >
                  Repetir Pedido
                </button>
                
                <button
                  className="w-full btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={() => speak('Función de descargar factura no implementada en esta demo')}
                  aria-label="Descargar factura"
                >
                  Descargar Factura
                </button>
              </div>

              {/* Información de contacto */}
              <div className="border-t pt-4 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">¿Necesitas ayuda?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>+34 123 456 789</span>
                  </div>
                  <p>Horario: 24/7</p>
                  <p>Estamos aquí para ayudarte</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 