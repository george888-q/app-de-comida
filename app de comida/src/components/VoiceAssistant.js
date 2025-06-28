// Forzar redeploy para ver cambios en Vercel
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, ChevronDown } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useNavigate, useLocation } from 'react-router-dom';

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { voiceAssistant, speak, toggleVoiceAssistant, handleVoiceCommand } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const recognitionRef = useRef(null);
  // Panel oculto por defecto en móvil, visible en escritorio
  const isMobile = window.innerWidth <= 640;
  const [isPanelVisible, setIsPanelVisible] = useState(() => window.innerWidth > 640);
  const [showQuickCommands, setShowQuickCommands] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [location]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
      setIsListening(true);
      speak('Te escucho. Di un comando.', true);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      setLastCommand(transcript);
      handleVoiceCommand(transcript, navigate);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      speak('Hubo un error con el asistente de voz. Intenta de nuevo.');
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
  }, [speak, handleVoiceCommand, navigate]);

  useEffect(() => {
    if (isListening) {
      setShowIndicator(true);
    } else {
      const timer = setTimeout(() => setShowIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isListening]);

  useEffect(() => {
    if (voiceAssistant && !isListening) {
      const commands = [
        'Buscar pizza',
        'Agregar al carrito',
        'Cambiar modo deuteranopia',
        'Subir tamaño de letra',
        'Confirmar pedido',
        'Leer ingredientes',
      ];
      const interval = setInterval(() => {
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        setLastCommand(randomCommand);
        speak(`Comando de ejemplo: ${randomCommand}`);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [voiceAssistant, isListening, speak]);

  if (!voiceAssistant) return null;

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // Botón flotante para mostrar el panel (solo en móvil y cuando está oculto)
  if (isMobile && !isPanelVisible) {
    return (
      <button
        className="fixed bottom-4 left-4 z-[100] bg-blue-600 text-white p-2 rounded-full shadow-lg sm:hidden"
        onClick={() => setIsPanelVisible(true)}
        aria-label="Mostrar asistente de voz"
        style={{ width: 44, height: 44 }}
      >
        <Volume2 className="h-5 w-5" />
      </button>
    );
  }

  return (
    <>
      {/* Indicador de escucha flotante */}
      {showIndicator && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-3 animate-pulse">
            <Mic className="h-5 w-5 animate-pulse" />
            <span className="font-medium">Te escucho...</span>
            <button
              onClick={stopListening}
              className="ml-2 p-1 hover:bg-blue-700 rounded-full transition-colors"
              aria-label="Detener escucha"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Panel de asistente de voz compacto en móvil */}
      <div
        className="bg-white rounded-lg shadow-lg p-2 sm:p-4 max-w-xs w-full mx-auto voice-assistant-panel relative"
        style={isMobile ? { position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 99, width: '90vw', maxWidth: 340 } : {}}
      >
        {/* Botón para ocultar el panel (solo en móvil) */}
        {isMobile && (
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 sm:hidden"
            onClick={() => setIsPanelVisible(false)}
            aria-label="Ocultar asistente de voz"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <Volume2 className="h-5 w-5 mr-2" />
            Asistente de Voz
          </h3>
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : voiceAssistant ? 'bg-gray-400' : 'bg-red-500'}`} />
        </div>
        {/* Botón para activar/desactivar el asistente de voz */}
        <div className="mb-2 sm:mb-4">
          <button
            onClick={toggleVoiceAssistant}
            className={`w-full flex items-center justify-center px-2 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors mb-2 text-sm sm:text-base ${voiceAssistant ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
            aria-label={voiceAssistant ? 'Desactivar asistente de voz' : 'Activar asistente de voz'}
          >
            {voiceAssistant ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Desactivar asistente
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Activar asistente
              </>
            )}
          </button>
          {!voiceAssistant && (
            <div className="bg-red-50 border border-red-200 rounded p-2 sm:p-3 text-red-800 text-xs sm:text-sm text-center">
              El asistente de voz está desactivado. Actívalo para usar comandos por voz.
            </div>
          )}
        </div>
        {/* Estado actual y controles solo si está activo */}
        {voiceAssistant && (
          <>
            <div className="mb-2 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                Estado: <span className={isListening ? 'text-green-600 font-medium' : 'text-gray-500'}>
                  {isListening ? 'Escuchando' : 'Inactivo'}
                </span>
              </p>
              {lastCommand && (
                <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs sm:text-sm text-gray-700">
                    <strong>Último comando:</strong> "{lastCommand}"
                  </p>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`flex-1 flex items-center justify-center px-2 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${isListening ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                aria-label={isListening ? 'Detener escucha' : 'Iniciar escucha'}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Detener
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Escuchar
                  </>
                )}
              </button>
            </div>
          </>
        )}
        {/* Botón para mostrar/ocultar comandos rápidos */}
        <div className="my-2">
          <button
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
            onClick={() => setShowQuickCommands((v) => !v)}
          >
            {showQuickCommands ? 'Ocultar comandos rápidos' : 'Mostrar comandos rápidos'}
          </button>
        </div>
        {/* Comandos rápidos y ayuda, solo si showQuickCommands está activo */}
        {showQuickCommands && (
          <>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">Comandos rápidos:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Buscar pizza',
                'Agregar al carrito',
                'Cambiar modo',
                'Ir a promociones',
                'Ir a métodos de pago',
                'Ir a preguntas frecuentes',
                'Ir a soporte de voz',
                'Ir a tutorial de audio',
                'Leer total del carrito',
                'Leer promociones',
                'Repetir',
                'Ayuda'
              ].map((command) => (
                <button
                  key={command}
                  onClick={() => {
                    speak(`Ejecutando: ${command}`);
                    handleVoiceCommand(command, navigate);
                  }}
                  className="text-xs sm:text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors w-full"
                  aria-label={`Ejecutar comando: ${command}`}
                >
                  {command}
                </button>
              ))}
            </div>
          </>
        )}
        <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
          <details className="text-xs sm:text-sm">
            <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
              Ver todos los comandos
            </summary>
            <div className="mt-2 space-y-1 text-xs text-gray-600">
              <p><strong>Búsqueda:</strong> "Buscar [comida]", "Encontrar [restaurante]"</p>
              <p><strong>Navegación:</strong> "Ir a restaurantes", "Ver carrito", "Ir a inicio", "Ir a promociones", "Ir a métodos de pago", "Ir a preguntas frecuentes", "Ir a soporte de voz", "Ir a tutorial de audio", "Ir a mi cuenta", "Perfil"</p>
              <p><strong>Carrito:</strong> "Agregar [producto]", "Confirmar pedido", "Leer total del carrito"</p>
              <p><strong>Accesibilidad:</strong> "Cambiar modo [tipo]", "Subir/bajar letra", "Activar/desactivar modo alto contraste", "Activar/desactivar modo daltónico"</p>
              <p><strong>Información:</strong> "Leer ingredientes", "Leer descripción", "Leer promociones"</p>
              <p><strong>Utilidad:</strong> "Repetir", "Ayuda", "Comandos disponibles"</p>
            </div>
          </details>
        </div>
      </div>

      {/* Indicador de ondas de sonido cuando está escuchando */}
      {isListening && (
        <div className="fixed inset-0 pointer-events-none z-30">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-8 bg-blue-500 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
            <p className="text-center text-blue-600 font-medium mt-4 text-lg">
              Habla ahora...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant; 