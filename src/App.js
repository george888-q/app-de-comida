import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AccessibilityNavigator from './contexts/AccessibilityNavigator';
import VoiceAssistant from './components/VoiceAssistant';

// Importaciones lazy para evitar renderizado automático
const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));
const Home = lazy(() => import('./pages/Home'));
const Restaurants = lazy(() => import('./pages/Restaurants'));
const RestaurantDetail = lazy(() => import('./pages/RestaurantDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const PaymentMethods = lazy(() => import('./pages/PaymentMethods'));
const Promotions = lazy(() => import('./pages/Promotions'));
const FAQ = lazy(() => import('./pages/FAQ'));
const VoiceSupport = lazy(() => import('./pages/VoiceSupport'));
const AudioTutorial = lazy(() => import('./pages/AudioTutorial'));

// Componente de carga
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Componente principal de la aplicación
const AppContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
      </Suspense>
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/voice-support" element={<VoiceSupport />} />
            <Route path="/audio-tutorial" element={<AudioTutorial />} />
          </Routes>
        </Suspense>
      </main>
      <Suspense fallback={<LoadingSpinner />}>
        <Footer />
      </Suspense>
      <VoiceAssistant />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AccessibilityNavigator>
        <AppContent />
      </AccessibilityNavigator>
    </Router>
  );
}

export default App; 