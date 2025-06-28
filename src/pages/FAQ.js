import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

const FAQ = () => {
  const { speak } = useAccessibility();

  useEffect(() => {
    speak('Página de preguntas frecuentes. Aquí puedes encontrar respuestas a las dudas más comunes.');
  }, [speak]);

  const faqs = [
    {
      question: '¿Cómo hago un pedido?',
      answer: 'Para hacer un pedido, navega por los restaurantes, selecciona los productos que desees y añádelos a tu carrito. Luego, procede al checkout para finalizar la compra.',
    },
    {
      question: '¿Cómo puedo pagar mi pedido?',
      answer: 'Actualmente, ofrecemos métodos de pago simulados como tarjeta de crédito/débito y PayPal. Puedes gestionar tus métodos de pago en la sección de Mi Cuenta.',
    },
    {
      question: '¿Puedo cambiar o cancelar mi pedido una vez realizado?',
      answer: 'Una vez que un pedido ha sido confirmado, no se puede cambiar ni cancelar directamente a través de la aplicación. Por favor, contacta con el soporte al cliente si necesitas asistencia urgente.',
    },
    {
      question: '¿Cómo utilizo el asistente de voz?',
      answer: 'Puedes activar el asistente de voz tocando el icono del micrófono en la barra superior. Una vez activado, puedes usar comandos como "Buscar pizza", "Agregar al carrito", "Ir a mi perfil", etc.',
    },
    {
      question: '¿Qué características de accesibilidad tiene la aplicación?',
      answer: 'Nuestra aplicación cuenta con un panel de accesibilidad para cambiar modos de color (protanopia, deuteranopia, tritanopia, alto contraste), ajustar el tamaño de fuente, y activar/desactivar el asistente de voz. Además, es compatible con lectores de pantalla y ofrece navegación completa por teclado.',
    },
    {
      question: '¿Dónde puedo ver mis pedidos anteriores?',
      answer: 'Puedes consultar el historial de tus pedidos en la sección "Historial de Pedidos" dentro de "Mi Pedido".',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/"
            className="btn btn-secondary flex items-center space-x-2"
            onClick={() => speak('Volviendo a la página de inicio')}
            aria-label="Volver a la página de inicio"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Inicio</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Preguntas Frecuentes</h1>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-6 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0">
              <h2 className="text-lg font-semibold text-gray-900 mb-2" tabIndex="0">
                <HelpCircle className="inline-block mr-2 h-5 w-5 text-blue-600" aria-hidden="true" />
                {faq.question}
              </h2>
              <p className="text-gray-700 ml-7" tabIndex="0">
                {faq.answer}
              </p>
            </div>
          ))}

          {/* Comandos de voz del asistente */}
          <div className="mt-10 pt-6 border-t border-gray-300">
            <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
              <HelpCircle className="inline-block mr-2 h-6 w-6" aria-hidden="true" />
              Comandos de voz del asistente
            </h2>
            <ul className="list-disc ml-10 text-gray-800 space-y-1 text-base">
              <li><b>Navegación:</b> "Ir sushi master", "Ir burger house", "Ir pizza express", "Ir taco fiesta", "Ir veggie garden", "Ir al carrito", "Ir a promociones", "Ir a perfil", "Ir a inicio", "Ir a configuración", "Ir a ayuda", "Ir a contacto", "Ir a métodos de pago", "Ir a historial de pedidos", "Ir a soporte", "Ir a favoritos", "Ir a notificaciones", "Ir a accesibilidad", "Cerrar sesión"</li>
              <li><b>Búsqueda:</b> "Buscar [comida]", "Encontrar [restaurante]"</li>
              <li><b>Carrito:</b> "Agregar [producto]", "Confirmar pedido", "Leer total del carrito"</li>
              <li><b>Accesibilidad:</b> "Cambiar modo normal", "Cambiar modo deuteranopia", "Cambiar modo protanopia", "Cambiar modo tritanopia", "Cambiar modo alto contraste", "Activar modo alto contraste", "Desactivar modo alto contraste", "Activar modo daltónico", "Desactivar modo daltónico", "Abrir panel de colores", "Cerrar panel de colores", "Subir tamaño de letra", "Bajar tamaño de letra"</li>
              <li><b>Información:</b> "Leer ingredientes", "Leer descripción", "Leer promociones"</li>
              <li><b>Utilidad:</b> "Repetir", "Ayuda", "Comandos disponibles"</li>
            </ul>
            <div className="mt-4 text-gray-700 text-sm bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <b>Nota sobre accesibilidad:</b> Puedes cambiar el modo visual de la aplicación usando comandos de voz como:<br/>
              <span className="font-mono">"Cambiar modo deuteranopia"</span>, <span className="font-mono">"Cambiar modo protanopia"</span>, <span className="font-mono">"Cambiar modo tritanopia"</span>, <span className="font-mono">"Cambiar modo alto contraste"</span> o <span className="font-mono">"Cambiar modo normal"</span>.<br/>
              También puedes decir <span className="font-mono">"Activar modo alto contraste"</span> o <span className="font-mono">"Desactivar modo alto contraste"</span>.<br/>
              Estos cambios se aplican de inmediato para facilitar la navegación a personas con discapacidad visual.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 