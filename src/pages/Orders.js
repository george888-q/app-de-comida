import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone, Package, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useCart } from '../contexts/CartContext';
import { orderStatuses } from '../data/mockData';

const Orders = () => {
  const { speak } = useAccessibility();
  const { orders } = useCart();
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    speak(`Página de pedidos. Tienes ${orders.length} pedidos en tu historial`);
  }, [orders.length, speak]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    speak(`Filtrando pedidos por estado: ${status || 'todos'}`);
  };

  const filteredOrders = selectedStatus 
    ? orders.filter(order => order.status === selectedStatus)
    : orders;

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparando':
        return 'bg-blue-100 text-blue-800';
      case 'en_camino':
        return 'bg-yellow-100 text-yellow-800';
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        return 'Tu pedido está siendo preparado en el restaurante';
      case 'en_camino':
        return 'Tu pedido está en camino hacia tu dirección';
      case 'entregado':
        return 'Tu pedido ha sido entregado exitosamente';
      case 'cancelado':
        return 'Tu pedido ha sido cancelado';
      default:
        return 'Estado desconocido';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No tienes pedidos aún</h1>
            <p className="text-lg text-gray-600 mb-8">
              Realiza tu primer pedido y aparecerá aquí
            </p>
            <Link
              to="/restaurants"
              className="btn btn-primary text-lg px-8 py-4"
              onClick={() => speak('Navegando a restaurantes')}
              aria-label="Explorar restaurantes para hacer un pedido"
            >
              Hacer mi Primer Pedido
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mis Pedidos</h1>
          <p className="text-lg text-gray-600">
            Revisa el estado de tus pedidos y el historial de compras
          </p>
        </div>

        {/* Filtros de estado */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Estado</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilter('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label="Mostrar todos los pedidos"
            >
              Todos ({orders.length})
            </button>
            {Object.entries(orderStatuses).map(([status, statusInfo]) => {
              const count = orders.filter(order => order.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  aria-label={`Mostrar pedidos ${statusInfo.label.toLowerCase()}`}
                >
                  <span>{statusInfo.icon}</span>
                  <span>{statusInfo.label} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de pedidos */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              onClick={() => speak(`Pedido ${order.id}. Estado: ${orderStatuses[order.status]?.label}. Total: $${order.total.toFixed(2)} dólares`)}
              role="button"
              tabIndex={0}
              aria-label={`Pedido ${order.id}. Estado: ${orderStatuses[order.status]?.label}. Total: $${order.total.toFixed(2)} dólares`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  speak(`Pedido ${order.id}. Estado: ${orderStatuses[order.status]?.label}. Total: $${order.total.toFixed(2)} dólares`);
                }
              }}
            >
              {/* Header del pedido */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pedido #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      <span className="mr-1">{orderStatuses[order.status]?.icon}</span>
                      {orderStatuses[order.status]?.label}
                    </div>
                    <div className="text-lg font-bold text-gray-900 mt-1">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del pedido */}
              <div className="p-6">
                {/* Productos */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Productos</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-gray-600">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Información de entrega */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Dirección de Entrega
                    </h4>
                    <div className="text-gray-600">
                      <p>{order.deliveryInfo.name}</p>
                      <p>{order.deliveryInfo.address}</p>
                      <p>{order.deliveryInfo.phone}</p>
                      {order.deliveryInfo.instructions && (
                        <p className="text-sm text-gray-500 mt-1">
                          <strong>Instrucciones:</strong> {order.deliveryInfo.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Información de Entrega
                    </h4>
                    <div className="text-gray-600">
                      <p><strong>Método de pago:</strong> {order.paymentMethod}</p>
                      <p><strong>Estimado de entrega:</strong> {formatDate(order.estimatedDelivery)}</p>
                      <p><strong>Estado:</strong> {getStatusDescription(order.status)}</p>
                    </div>
                  </div>
                </div>

                {/* Barra de progreso del estado */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Progreso del Pedido</h4>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          order.status === 'preparando' || order.status === 'en_camino' || order.status === 'entregado'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          <Package className="h-3 w-3" />
                        </div>
                        <span className="text-sm">Preparando</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          order.status === 'en_camino' || order.status === 'entregado'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          <Truck className="h-3 w-3" />
                        </div>
                        <span className="text-sm">En Camino</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          order.status === 'entregado'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <span className="text-sm">Entregado</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          order.status === 'preparando' ? 'bg-blue-600 w-1/3' :
                          order.status === 'en_camino' ? 'bg-blue-600 w-2/3' :
                          order.status === 'entregado' ? 'bg-green-600 w-full' :
                          'bg-gray-300 w-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Link
                    to={`/order/${order.id}`}
                    className="btn btn-secondary"
                    onClick={() => speak(`Ver detalles del pedido ${order.id}`)}
                    aria-label={`Ver detalles completos del pedido ${order.id}`}
                  >
                    Ver Detalles
                  </Link>
                  
                  {order.status === 'preparando' && (
                    <button
                      className="btn bg-red-600 text-white hover:bg-red-700"
                      onClick={() => speak('Función de cancelación no implementada en esta demo')}
                      aria-label="Cancelar pedido"
                    >
                      Cancelar Pedido
                    </button>
                  )}
                  
                  {order.status === 'entregado' && (
                    <button
                      className="btn btn-primary"
                      onClick={() => speak('Función de repetir pedido no implementada en esta demo')}
                      aria-label="Repetir pedido"
                    >
                      Repetir Pedido
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no hay pedidos con el filtro */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay pedidos con este estado
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta con otro filtro o haz un nuevo pedido
            </p>
            <button
              onClick={() => handleStatusFilter('')}
              className="btn btn-primary"
              aria-label="Ver todos los pedidos"
            >
              Ver Todos los Pedidos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 