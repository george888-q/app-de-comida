import React from 'react';
import { AccessibilityProvider } from './AccessibilityContext';
import { CartProvider } from './CartContext';

const AccessibilityNavigator = ({ children }) => {
  return (
    <AccessibilityProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AccessibilityProvider>
  );
};

export default AccessibilityNavigator; 