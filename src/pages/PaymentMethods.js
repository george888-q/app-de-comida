import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Plus, Trash2, Edit, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { paymentMethods as mockPaymentMethods } from '../data/mockData'; // Renombrar para evitar conflicto

const PaymentMethods = () => {
  const { speak } = useAccessibility();
  const [userPaymentMethods, setUserPaymentMethods] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethodId, setEditingMethodId] = useState(null);
  const [newCard, setNewCard] = useState({
    id: '',
    name: '',
    type: 'card', // 'card' o 'paypal' (simulado)
    email: '',
    isDefault: false,
  });

  useEffect(() => {
    speak('Página de métodos de pago. Aquí puedes añadir o gestionar tus formas de pago.');
    // Simular carga de métodos de pago guardados
    const savedMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [
      { id: 'mock-card-1', name: 'Tarjeta de Crédito', type: 'card', cardNumber: '**** **** **** 1234', expiryDate: '12/25', isDefault: true },
      { id: 'mock-paypal-1', name: 'PayPal', type: 'paypal', email: 'juan.perez@example.com', isDefault: false },
    ];
    setUserPaymentMethods(savedMethods);
  }, [speak]);

  useEffect(() => {
    localStorage.setItem('userPaymentMethods', JSON.stringify(userPaymentMethods));
  }, [userPaymentMethods]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMethod = (e) => {
    e.preventDefault();
    if (!newCard.name || (newCard.type === 'paypal' && !newCard.email)) {
      speak('Por favor, rellena todos los campos requeridos.');
      return;
    }

    const methodToAdd = {
      ...newCard,
      id: `method-${Date.now()}`,
    };

    setUserPaymentMethods(prev => {
      const updatedMethods = prev.map(m => ({ ...m, isDefault: false }));
      return newCard.isDefault ? [methodToAdd, ...updatedMethods] : [...updatedMethods, methodToAdd];
    });
    
    speak(`${newCard.name} agregado exitosamente.`);
    setNewCard({
      id: '',
      name: '',
      type: 'card',
      email: '',
      isDefault: false,
    });
    setShowAddForm(false);
  };

  const handleDeleteMethod = (idToDelete, name) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${name}?`)) {
      setUserPaymentMethods(prev => prev.filter(method => method.id !== idToDelete));
      speak(`${name} eliminado.`);
    }
  };

  const handleSetDefault = (idToSetDefault, name) => {
    setUserPaymentMethods(prev =>
      prev.map(method => ({ ...method, isDefault: method.id === idToSetDefault }))
    );
    speak(`${name} establecido como método de pago predeterminado.`);
  };

  const handleEditClick = (method) => {
    setEditingMethodId(method.id);
    setNewCard({
      id: method.id,
      name: method.name,
      type: method.type,
      email: method.email || '',
      isDefault: method.isDefault || false,
    });
    setShowAddForm(true);
    speak(`Editando método de pago: ${method.name}`);
  };

  const handleUpdateMethod = (e) => {
    e.preventDefault();
    setUserPaymentMethods(prev =>
      prev.map(method =>
        method.id === editingMethodId
          ? {
              ...newCard,
              id: editingMethodId,
            }
          : method
      )
    );
    speak(`${newCard.name} actualizado exitosamente.`);
    setEditingMethodId(null);
    setNewCard({
      id: '',
      name: '',
      type: 'card',
      email: '',
      isDefault: false,
    });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/account/profile"
            className="btn btn-secondary flex items-center space-x-2"
            onClick={() => speak('Volviendo al perfil')}
            aria-label="Volver a la página de perfil"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Mi Perfil</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Métodos de Pago</h1>
        </div>

        {/* Lista de métodos de pago existentes */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Métodos de Pago</h2>
          {userPaymentMethods.length === 0 ? (
            <p className="text-gray-600">No tienes métodos de pago guardados.</p>
          ) : (
            <div className="space-y-4">
              {userPaymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  role="listitem"
                  aria-label={`Método de pago: ${method.name}. ${method.isDefault ? 'Predeterminado.' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">
                      {method.type === 'card' ? '💳' : '📱'}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900 flex items-center space-x-2">
                        <span>{method.name}</span>
                        {method.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Predeterminado</span>
                        )}
                      </div>
                      {method.type === 'paypal' && (
                        <p className="text-sm text-gray-600">{method.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id, method.name)}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-full"
                        aria-label={`Establecer como predeterminado ${method.name}`}
                        title="Establecer como predeterminado"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEditClick(method)}
                      className="text-gray-600 hover:text-gray-800 p-2 rounded-full"
                      aria-label={`Editar ${method.name}`}
                      title="Editar método de pago"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMethod(method.id, method.name)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full"
                      aria-label={`Eliminar ${method.name}`}
                      title="Eliminar método de pago"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón para añadir nuevo método */}
        {!showAddForm && (
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingMethodId(null);
              setNewCard({
                id: '',
                name: '',
                type: 'card',
                email: '',
                isDefault: false,
              });
              speak('Abriendo formulario para añadir nuevo método de pago.');
            }}
            className="btn btn-primary flex items-center justify-center space-x-2 w-full py-3"
            aria-label="Añadir nuevo método de pago"
          >
            <Plus className="h-5 w-5" />
            <span>Añadir Nuevo Método</span>
          </button>
        )}

        {/* Formulario para añadir/editar método de pago */}
        {showAddForm && (
          <form onSubmit={editingMethodId ? handleUpdateMethod : handleAddMethod} className="space-y-4 mt-6" aria-label="Formulario de método de pago">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del método</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCard.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                id="type"
                name="type"
                value={newCard.type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
                aria-required="true"
              >
                <option value="card">Tarjeta de crédito/débito (simulado)</option>
                <option value="paypal">PayPal (simulado)</option>
              </select>
            </div>
            {newCard.type === 'card' ? (
              <div className="bg-blue-50 border border-blue-200 rounded p-4 text-blue-800 text-sm">
                Este es un método de pago simulado. No es necesario ingresar datos reales.
              </div>
            ) : (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo de PayPal</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newCard.email || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required={newCard.type === 'paypal'}
                  aria-required={newCard.type === 'paypal' ? 'true' : 'false'}
                />
              </div>
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={newCard.isDefault}
                onChange={e => setNewCard(prev => ({ ...prev, isDefault: e.target.checked }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">Establecer como predeterminado</label>
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="btn btn-primary">
                {editingMethodId ? 'Guardar cambios' : 'Agregar método'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowAddForm(false); setEditingMethodId(null); }}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods; 