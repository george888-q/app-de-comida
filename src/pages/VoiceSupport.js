import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mic, Headphones, MessageSquare, Phone } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

const VoiceSupport = () => {
  const { speak } = useAccessibility();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false); // Simula el estado de escucha

  useEffect(() => {
    speak('Página de soporte por voz. Aquí puedes recibir asistencia directamente mediante comandos de voz o contactar a nuestro equipo.');
  }, [speak]);

  const handleStartVoiceInput = () => {
    setIsListening(true);
    speak('Escuchando. Di tu pregunta o el comando para el que necesitas ayuda.');
    // Simular el fin de la escucha después de un breve periodo
    setTimeout(() => {
      setIsListening(false);
      setMessage('Simulación: "Necesito ayuda con mi pedido."');
      speak('He recibido tu mensaje: Necesito ayuda con mi pedido. Un agente se pondrá en contacto contigo pronto.');
    }, 3000);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      speak(`Mensaje enviado: ${message}. Nuestro equipo de soporte te responderá a la brevedad.`);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/help/faq"
            className="btn btn-secondary flex items-center space-x-2"
            onClick={() => speak('Volviendo a preguntas frecuentes')}
            aria-label="Volver a la página de preguntas frecuentes"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Preguntas Frecuentes</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Soporte por Voz</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Asistencia Inmediata por Voz</h2>
          <p className="text-gray-600 mb-4">
            Usa el micrófono para describir tu problema o hacer una pregunta. Nuestro sistema intentará darte una respuesta instantánea o te conectará con un asistente.
          </p>
          <button
            onClick={handleStartVoiceInput}
            className={`btn flex items-center justify-center space-x-2 w-full py-3 ${isListening ? 'bg-green-500 hover:bg-green-600' : 'btn-primary'}`}
            aria-label={isListening ? 'Escuchando tu voz...' : 'Iniciar asistencia por voz'}
            disabled={isListening}
          >
            {isListening ? (
              <span className="flex items-center"><Mic className="h-5 w-5 mr-2 animate-pulse" /> Escuchando...</span>
            ) : (
              <span className="flex items-center"><Mic className="h-5 w-5 mr-2" /> Iniciar Asistencia por Voz</span>
            )}
          </button>
          {message && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800" role="status">
              <p className="font-medium">Mensaje de voz recibido:</p>
              <p className="text-sm">{message}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Otras Formas de Contacto</h2>
          <p className="text-gray-600 mb-4">
            Si prefieres no usar el soporte por voz o necesitas ayuda más detallada, puedes contactarnos por:
          </p>
          <div className="space-y-4">
            <a
              href="tel:+34123456789"
              className="btn btn-secondary flex items-center space-x-2 w-full justify-center"
              onClick={() => speak('Llamando al soporte telefónico')}
              aria-label="Llamar a soporte telefónico"
            >
              <Phone className="h-5 w-5" />
              <span>Llamar a Soporte (Simulado)</span>
            </a>
            <Link
              to="/contact-us"
              className="btn btn-secondary flex items-center space-x-2 w-full justify-center"
              onClick={() => speak('Abriendo formulario de contacto')}
              aria-label="Abrir formulario de contacto"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Enviar Mensaje de Texto (Simulado)</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preguntas Frecuentes Relacionadas</h2>
          <p className="text-gray-600 mb-4">¿Buscas respuestas rápidas? Visita nuestra sección de preguntas frecuentes:</p>
          <Link
            to="/help/faq"
            className="btn btn-secondary flex items-center justify-center space-x-2 w-full"
            onClick={() => speak('Navegando a preguntas frecuentes')}
            aria-label="Ir a la página de preguntas frecuentes"
          >
            <Headphones className="h-5 w-5" />
            <span>Ir a Preguntas Frecuentes</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VoiceSupport; 