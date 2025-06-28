import React, { useState, useEffect } from 'react';
import { Settings, Eye, Type, Volume2, VolumeX, Palette } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    colorMode,
    setColorMode,
    fontSize,
    setFontSize,
    voiceAssistant,
    toggleVoiceAssistant,
    speak,
    showColorPanel,
    setShowColorPanel,
  } = useAccessibility();

  const colorModes = [
    { id: 'normal', label: 'Normal', description: 'Colores estándar' },
    { id: 'deuteranopia', label: 'Deuteranopia', description: 'Para daltonismo rojo-verde' },
    { id: 'protanopia', label: 'Protanopia', description: 'Para daltonismo rojo-verde severo' },
    { id: 'tritanopia', label: 'Tritanopia', description: 'Para daltonismo azul-amarillo' },
    { id: 'highContrast', label: 'Alto Contraste', description: 'Fondo negro, texto blanco' },
  ];

  const fontSizes = [
    { id: 'xs', label: 'Muy Pequeño', size: '0.75rem' },
    { id: 'sm', label: 'Pequeño', size: '0.875rem' },
    { id: 'base', label: 'Normal', size: '1rem' },
    { id: 'lg', label: 'Grande', size: '1.125rem' },
    { id: 'xl', label: 'Muy Grande', size: '1.25rem' },
    { id: '2xl', label: 'Extra Grande', size: '1.5rem' },
    { id: '3xl', label: 'Super Grande', size: '1.875rem' },
  ];

  const handleColorModeChange = (mode) => {
    setColorMode(mode);
    speak(`Cambiando a modo ${colorModes.find(m => m.id === mode)?.label}`);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    speak(`Cambiando tamaño de letra a ${fontSizes.find(s => s.id === size)?.label}`);
  };

  const handleVoiceToggle = () => {
    toggleVoiceAssistant();
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
    speak(isOpen ? 'Panel de accesibilidad cerrado' : 'Panel de accesibilidad abierto');
  };

  useEffect(() => {
    if (showColorPanel) {
      setIsOpen(true);
      setShowColorPanel(false);
    }
  }, [showColorPanel, setShowColorPanel]);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={togglePanel}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200"
        aria-label="Abrir panel de accesibilidad"
        aria-expanded={isOpen}
      >
        <Settings className="h-6 w-6" />
      </button>

      {/* Panel de accesibilidad */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={togglePanel}>
          <div 
            className="fixed right-6 bottom-20 w-80 max-h-96 bg-white rounded-lg shadow-xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Panel de accesibilidad"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Accesibilidad
              </h2>
              <button
                onClick={togglePanel}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Cerrar panel de accesibilidad"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Modo de color */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Modo de Color
              </h3>
              <div className="space-y-2">
                {colorModes.map((mode) => (
                  <label
                    key={mode.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="colorMode"
                      value={mode.id}
                      checked={colorMode === mode.id}
                      onChange={() => handleColorModeChange(mode.id)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      aria-label={`Seleccionar modo ${mode.label}`}
                    />
                    <div>
                      <div className="font-medium text-gray-900">{mode.label}</div>
                      <div className="text-sm text-gray-500">{mode.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Tamaño de letra */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Type className="h-4 w-4 mr-2" />
                Tamaño de Letra
              </h3>
              <div className="space-y-2">
                {fontSizes.map((size) => (
                  <label
                    key={size.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="fontSize"
                      value={size.id}
                      checked={fontSize === size.id}
                      onChange={() => handleFontSizeChange(size.id)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      aria-label={`Seleccionar tamaño ${size.label}`}
                    />
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 mr-2">{size.label}</span>
                      <span 
                        className="text-gray-500"
                        style={{ fontSize: size.size }}
                      >
                        Ejemplo
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Asistente de voz */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                {voiceAssistant ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                Asistente de Voz
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">
                    {voiceAssistant ? 'Activado' : 'Desactivado'}
                  </span>
                  <button
                    onClick={handleVoiceToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      voiceAssistant ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                    aria-label={voiceAssistant ? 'Desactivar asistente de voz' : 'Activar asistente de voz'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        voiceAssistant ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {voiceAssistant 
                    ? 'El asistente de voz está activo. Puedes usar comandos como "buscar pizza" o "agregar al carrito".'
                    : 'Activa el asistente de voz para navegar con comandos hablados.'
                  }
                </p>
              </div>
            </div>

            {/* Comandos de voz */}
            {voiceAssistant && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Comandos de Voz</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-blue-50 rounded">
                    <strong>Búsqueda:</strong> "Buscar pizza", "Encontrar hamburguesas"
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <strong>Carrito:</strong> "Agregar al carrito", "Confirmar pedido"
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <strong>Accesibilidad:</strong> "Cambiar modo deuteranopia", "Subir tamaño de letra"
                  </div>
                  <div className="p-2 bg-blue-50 rounded">
                    <strong>Ayuda:</strong> "Ayuda" o "Comandos"
                  </div>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="text-xs text-gray-500 text-center">
              <p>Esta aplicación está diseñada para ser completamente accesible.</p>
              <p>Usa Tab para navegar y Enter para activar elementos.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityPanel; 