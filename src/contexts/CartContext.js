import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccessibility } from './AccessibilityContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const { speak } = useAccessibility();

  // Cargar carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Guardar pedidos en localStorage
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Agregar producto al carrito
  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      
      if (existingProduct) {
        const updatedCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        speak(`Agregado ${quantity} más de ${product.name} al carrito`);
        return updatedCart;
      } else {
        const newCart = [...prevCart, { ...product, quantity }];
        speak(`${product.name} agregado al carrito`);
        return newCart;
      }
    });
  }, [speak]);

  // Remover producto del carrito
  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => {
      const product = prevCart.find(item => item.id === productId);
      const newCart = prevCart.filter(item => item.id !== productId);
      if (product) {
        speak(`${product.name} removido del carrito`);
      }
      return newCart;
    });
  }, [speak]);

  // Actualizar cantidad de producto
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  // Limpiar carrito
  const clearCart = useCallback(() => {
    setCart([]);
    speak('Carrito vaciado');
  }, [speak]);

  // Calcular total del carrito
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  // Calcular cantidad total de items
  const getCartItemCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Crear nuevo pedido
  const createOrder = useCallback((deliveryInfo, paymentMethod) => {
    const newOrder = {
      id: Date.now().toString(),
      items: [...cart],
      total: getCartTotal(),
      deliveryInfo,
      paymentMethod,
      status: 'preparando',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setCart([]);
    
    speak(`Pedido confirmado. Tu pedido será entregado en aproximadamente 30 minutos. Número de pedido: ${newOrder.id}`);
    
    return newOrder;
  }, [cart, getCartTotal, speak]);

  // Actualizar estado del pedido
  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status }
          : order
      )
    );
  }, []);

  // Obtener pedido por ID
  const getOrderById = useCallback((orderId) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const value = {
    cart,
    orders,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    createOrder,
    updateOrderStatus,
    getOrderById,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 