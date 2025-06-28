import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Percent, Gift } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { promotions as mockPromotions } from '../data/mockData';

const Promotions = () => {
  const { speak } = useAccessibility();

  useEffect(() => {
    speak('Página de promociones. Aquí puedes encontrar las mejores ofertas y descuentos.');
  }, [speak]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/restaurants"
            className="btn btn-secondary flex items-center space-x-2"
            onClick={() => speak('Volviendo a la lista de restaurantes')}
            aria-label="Volver a la página de restaurantes"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Restaurantes</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Promociones</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600 mb-6">
            ¡No te pierdas nuestras ofertas especiales! Aquí encontrarás descuentos 
            exclusivos y promociones por tiempo limitado.
          </p>

          {mockPromotions.length === 0 ? (
            <div className="text-center py-10">
              <Gift className="w-20 h-20 text-gray-400 mx-auto mb-4" aria-hidden="true"/>
              <p className="text-xl text-gray-700 font-semibold">No hay promociones activas en este momento.</p>
              <p className="text-gray-500 mt-2">Vuelve pronto para descubrir nuevas ofertas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Lista de promociones">
              {mockPromotions.map((promo) => (
                <div 
                  key={promo.id} 
                  className="border border-primary-200 bg-primary-50 rounded-lg p-6 flex flex-col items-center text-center shadow-md"
                  role="listitem"
                  aria-label={`Promoción: ${promo.title}. Descuento del ${promo.discountPercentage} por ciento.`}
                >
                  <Percent className="h-12 w-12 text-primary-600 mb-4" aria-hidden="true"/>
                  <h3 className="text-xl font-bold text-primary-800 mb-2">{promo.title}</h3>
                  <p className="text-lg text-primary-700 mb-3">{promo.description}</p>
                  <p className="text-4xl font-extrabold text-primary-900 mb-4">{promo.discountPercentage}% OFF</p>
                  {promo.minOrderValue && (
                    <p className="text-sm text-gray-600 mb-2">Pedido mínimo: ${promo.minOrderValue.toFixed(2)}</p>
                  )}
                  <button 
                    className="btn btn-primary w-full mt-auto"
                    onClick={() => {
                      speak(`Promoción ${promo.title} activada. Detalles: ${promo.description}`);
                      alert(`Aplicando promoción: ${promo.title}`);
                      // Aquí se implementaría la lógica para aplicar la promoción (ej. añadir al carrito, guardar código)
                    }}
                    aria-label={`Activar promoción ${promo.title}`}
                  >
                    Activar Promoción
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Promotions; 