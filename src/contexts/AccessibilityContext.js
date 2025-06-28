import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe ser usado dentro de un AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [colorMode, setColorMode] = useState('normal'); // normal, deuteranopia, protanopia, tritanopia, highContrast
  const [fontSize, setFontSize] = useState('base'); // xs, sm, base, lg, xl, 2xl, 3xl
  const [voiceAssistant, setVoiceAssistant] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [lastSpoken, setLastSpoken] = useState('');
  const lastSpokenRef = useRef(lastSpoken);
  const [showColorPanel, setShowColorPanel] = useState(false);

  useEffect(() => {
    lastSpokenRef.current = lastSpoken;
  }, [lastSpoken]);

  // Función para hablar
  const speak = useCallback((text, force = false) => {
    if (!voiceAssistant && !force) return;
    if (speechSynthesis) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      if (lastSpoken !== text) {
        setLastSpoken(text); // Solo actualiza si es diferente
      }
    }
  }, [speechSynthesis, voiceAssistant, lastSpoken]);

  // Función para vibrar
  const vibrate = useCallback((pattern = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  // Iniciar reconocimiento de voz
  const startListening = useCallback(() => {
    if (speechRecognition && voiceAssistant) {
      speechRecognition.start();
    }
  }, [speechRecognition, voiceAssistant]);

  // Detener reconocimiento de voz
  const stopListening = useCallback(() => {
    if (speechRecognition) {
      speechRecognition.stop();
    }
  }, [speechRecognition]);

  // Función de distancia de Levenshtein para fuzzy matching
  function levenshtein(a, b) {
    const an = a ? a.length : 0;
    const bn = b ? b.length : 0;
    if (an === 0) return bn;
    if (bn === 0) return an;
    const matrix = [];
    for (let i = 0; i <= bn; ++i) matrix[i] = [i];
    for (let j = 0; j <= an; ++j) matrix[0][j] = j;
    for (let i = 1; i <= bn; ++i) {
      for (let j = 1; j <= an; ++j) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // sustitución
            matrix[i][j - 1] + 1,     // inserción
            matrix[i - 1][j] + 1      // eliminación
          );
        }
      }
    }
    return matrix[bn][an];
  }

  // Función para coincidencia flexible de comandos
  function fuzzyIncludes(cmd, target, maxDistance = 3) {
    cmd = cmd.toLowerCase();
    target = target.toLowerCase();
    if (cmd.includes(target)) return true;
    const words = cmd.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (levenshtein(words[i], target) <= maxDistance) return true;
    }
    if (levenshtein(cmd, target) <= maxDistance) return true;
    return false;
  }

  // Manejar comandos de voz
  const handleVoiceCommand = useCallback((command, navigate) => {
    console.log('[DEBUG] Comando recibido:', command);
    const lowerCmd = command.toLowerCase();

    // --- Comandos de navegación a restaurantes por nombre (fuzzy) ---
    const restaurantes = [
      { nombre: 'sushi master', ruta: '/restaurant/3' },
      { nombre: 'burger house', ruta: '/restaurant/2' },
      { nombre: 'pizza express', ruta: '/restaurant/1' },
      { nombre: 'taco fiesta', ruta: '/restaurant/4' },
      { nombre: 'veggie garden', ruta: '/restaurant/5' },
    ];
    for (const rest of restaurantes) {
      const fuzzyRest = fuzzyIncludes(lowerCmd, rest.nombre, 3);
      const fuzzyIr = lowerCmd.includes('ir') || fuzzyIncludes(lowerCmd, 'ir', 2);
      console.log(`[DEBUG] Probar restaurante: ${rest.nombre} | fuzzyRest: ${fuzzyRest} | fuzzyIr: ${fuzzyIr}`);
      if ((fuzzyIr && fuzzyRest) || fuzzyRest) {
        console.log(`[DEBUG] Navegando a ${rest.nombre} (ruta: ${rest.ruta})`);
        speak(`Navegando a ${rest.nombre}.`);
        if (navigate) navigate(rest.ruta);
        return;
      }
    }

    // --- Comando para repetir la última instrucción ---
    if (lowerCmd.includes('repetir')) {
      if (lastSpokenRef.current) {
        speak(lastSpokenRef.current, true);
      } else {
        speak('No hay nada que repetir.', true);
      }
      return;
    }

    // --- Comandos de búsqueda ---
    if (lowerCmd.startsWith('buscar ') || lowerCmd.startsWith('encontrar ')) {
      const query = lowerCmd.replace('buscar ', '').replace('encontrar ', '');
      speak(`Buscando: ${query}`);
      // Aquí podrías navegar o filtrar productos
      return;
    }

    // --- Comandos de navegación ampliados ---
    if (lowerCmd.includes('ir a restaurantes')) {
      speak('Navegando a la lista de restaurantes.');
      if (navigate) navigate('/restaurants');
      return;
    }
    if (lowerCmd.includes('ver carrito')) {
      speak('Abriendo el carrito de compras.');
      if (navigate) navigate('/cart');
      return;
    }
    if (lowerCmd.includes('ir a inicio')) {
      speak('Navegando a la página de inicio.');
      if (navigate) navigate('/');
      return;
    }
    if (lowerCmd.includes('ir a mi cuenta') || lowerCmd.includes('perfil')) {
      speak('Abriendo tu perfil.');
      if (navigate) navigate('/profile');
      return;
    }
    if (lowerCmd.includes('promociones') || lowerCmd.includes('ir a promociones')) {
      speak('Mostrando promociones.');
      if (navigate) navigate('/promotions');
      return;
    }
    if (lowerCmd.includes('métodos de pago') || lowerCmd.includes('metodos de pago') || lowerCmd.includes('ir a métodos de pago')) {
      speak('Abriendo métodos de pago.');
      if (navigate) navigate('/payment-methods');
      return;
    }
    if (lowerCmd.includes('faq') || lowerCmd.includes('preguntas frecuentes') || lowerCmd.includes('ayuda')) {
      speak('Abriendo preguntas frecuentes.');
      if (navigate) navigate('/faq');
      return;
    }
    if (lowerCmd.includes('soporte de voz') || lowerCmd.includes('asistencia de voz') || lowerCmd.includes('soporte')) {
      speak('Abriendo soporte de voz.');
      if (navigate) navigate('/voice-support');
      return;
    }
    if (lowerCmd.includes('tutorial de audio') || lowerCmd.includes('audio tutorial')) {
      speak('Abriendo tutorial de audio.');
      if (navigate) navigate('/audio-tutorial');
      return;
    }
    if (lowerCmd.includes('configuración') || lowerCmd.includes('configuracion')) {
      speak('Abriendo configuración.');
      if (navigate) navigate('/settings');
      return;
    }
    if (lowerCmd.includes('contacto')) {
      speak('Abriendo contacto.');
      if (navigate) navigate('/contact');
      return;
    }
    if (lowerCmd.includes('historial de pedidos')) {
      speak('Abriendo historial de pedidos.');
      if (navigate) navigate('/orders');
      return;
    }
    if (lowerCmd.includes('favoritos')) {
      speak('Abriendo favoritos.');
      if (navigate) navigate('/favorites');
      return;
    }
    if (lowerCmd.includes('notificaciones')) {
      speak('Abriendo notificaciones.');
      if (navigate) navigate('/notifications');
      return;
    }
    if (lowerCmd.includes('accesibilidad')) {
      speak('Abriendo opciones de accesibilidad.');
      if (navigate) navigate('/accessibility');
      return;
    }
    if (lowerCmd.includes('cerrar sesión') || lowerCmd.includes('cerrar sesion')) {
      speak('Cerrando sesión.');
      if (navigate) navigate('/logout');
      return;
    }

    // --- Comandos de carrito y pedido ---
    if (lowerCmd.includes('leer total del carrito') || lowerCmd.includes('total del carrito')) {
      // Aquí deberías obtener el total real del carrito
      speak('El total de tu carrito es de 0 dólares.');
      return;
    }

    // --- Comando de ayuda ---
    if (lowerCmd.includes('ayuda') || lowerCmd.includes('comandos')) {
      speak('Puedes decir: Ir sushi master, Ir burger house, Ir pizza express, Ir taco fiesta, Ir veggie garden, Ir al carrito, Ir a promociones, Ir a perfil, Ir a inicio, Ir a configuración, Ir a ayuda, Ir a contacto, Ir a métodos de pago, Ir a historial de pedidos, Ir a soporte, Ir a favoritos, Ir a notificaciones, Ir a accesibilidad, Cerrar sesión, Ayuda, Cambiar modo, Leer total del carrito, Leer promociones, Repetir, entre otros.');
      return;
    }

    // --- Comandos de accesibilidad ampliados ---
    if ((lowerCmd.includes('activar') || lowerCmd.includes('desactivar')) && lowerCmd.includes('modo alto contraste')) {
      if (lowerCmd.includes('activar')) {
        setColorMode('high-contrast');
        speak('Modo alto contraste activado.');
      } else {
        setColorMode('normal');
        speak('Modo alto contraste desactivado.');
      }
      return;
    }
    if ((lowerCmd.includes('activar') || lowerCmd.includes('desactivar')) && lowerCmd.includes('modo daltónico')) {
      if (lowerCmd.includes('activar')) {
        setColorMode('deuteranopia');
        speak('Modo daltónico activado.');
      } else {
        setColorMode('normal');
        speak('Modo daltónico desactivado.');
      }
      return;
    }
    if (lowerCmd.startsWith('cambiar modo ')) {
      if (lowerCmd.includes('deuteranopia')) {
        setColorMode('deuteranopia');
        speak('Cambiando a modo deuteranopia.');
        return;
      } else if (lowerCmd.includes('protanopia')) {
        setColorMode('protanopia');
        speak('Cambiando a modo protanopia.');
        return;
      } else if (lowerCmd.includes('tritanopia')) {
        setColorMode('tritanopia');
        speak('Cambiando a modo tritanopia.');
        return;
      } else if (lowerCmd.includes('alto contraste')) {
        setColorMode('high-contrast');
        speak('Cambiando a modo alto contraste.');
        return;
      } else if (lowerCmd.includes('normal')) {
        setColorMode('normal');
        speak('Cambiando a modo normal.');
        return;
      } else {
        speak('Modo no reconocido. Puedes decir: normal, deuteranopia, protanopia, tritanopia o alto contraste.');
        return;
      }
    }
    if ((lowerCmd.includes('subir') || lowerCmd.includes('aumentar')) && lowerCmd.includes('tamaño de letra')) {
      const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'];
      const currentIndex = sizes.indexOf(fontSize);
      if (currentIndex < sizes.length - 1) {
        setFontSize(sizes[currentIndex + 1]);
        speak('Aumentando el tamaño de letra.');
      } else {
        speak('Ya tienes el tamaño de letra máximo.');
      }
      return;
    }
    if ((lowerCmd.includes('bajar') || lowerCmd.includes('disminuir')) && lowerCmd.includes('tamaño de letra')) {
      const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'];
      const currentIndex = sizes.indexOf(fontSize);
      if (currentIndex > 0) {
        setFontSize(sizes[currentIndex - 1]);
        speak('Disminuyendo el tamaño de letra.');
      } else {
        speak('Ya tienes el tamaño de letra mínimo.');
      }
      return;
    }

    // --- Comandos de información ampliados ---
    if (lowerCmd.includes('leer ingredientes')) {
      speak('Estos son los ingredientes del producto seleccionado. El precio se muestra en dólares.');
      // Aquí podrías leer ingredientes reales del producto seleccionado
      return;
    }
    if (lowerCmd.includes('leer descripción')) {
      speak('Esta es la descripción del producto seleccionado.');
      // Aquí podrías leer la descripción real del producto seleccionado
      return;
    }
    if (lowerCmd.includes('leer promociones')) {
      speak('Estas son las promociones actuales: 2x1 en pizzas, 10% de descuento en tu primer pedido.');
      // Aquí podrías leer promociones reales
      return;
    }

    // --- Comandos adicionales de navegación y utilidad ---
    if (lowerCmd.includes('ir a pedidos') || lowerCmd.includes('ver mis pedidos')) {
      speak('Mostrando tus pedidos.');
      if (navigate) navigate('/orders');
      return;
    }
    if (lowerCmd.includes('ir a menú principal') || lowerCmd.includes('ir a menu principal')) {
      speak('Navegando al menú principal.');
      if (navigate) navigate('/');
      return;
    }
    if (lowerCmd.includes('ir a productos destacados')) {
      speak('Mostrando productos destacados.');
      if (navigate) navigate('/featured');
      return;
    }
    if (lowerCmd.includes('ir a hamburguesas')) {
      speak('Mostrando menú de hamburguesas.');
      if (navigate) navigate('/category/hamburguesas');
      return;
    }
    if (lowerCmd.includes('ir a inicio de sesión') || lowerCmd.includes('iniciar sesión')) {
      speak('Navegando a inicio de sesión.');
      if (navigate) navigate('/login');
      return;
    }
    if (lowerCmd.includes('ir a registro') || lowerCmd.includes('crear cuenta')) {
      speak('Navegando a registro de usuario.');
      if (navigate) navigate('/register');
      return;
    }
    if (lowerCmd.includes('abrir menú')) {
      speak('Menú abierto.');
      // Aquí deberías abrir el menú lateral si tienes uno
      return;
    }
    if (lowerCmd.includes('cerrar menú')) {
      speak('Menú cerrado.');
      // Aquí deberías cerrar el menú lateral si tienes uno
      return;
    }
    if (lowerCmd.includes('abrir asistente')) {
      speak('Asistente de voz abierto.');
      setVoiceAssistant(true);
      return;
    }
    if (lowerCmd.includes('cerrar asistente')) {
      speak('Asistente de voz cerrado.');
      setVoiceAssistant(false);
      return;
    }
    if (lowerCmd.includes('leer instrucciones')) {
      speak('Para navegar por la app puedes usar comandos de voz como: ir a restaurantes, ver carrito, cambiar modo, entre otros.');
      return;
    }
    if (lowerCmd.includes('leer contacto')) {
      speak('Puedes contactarnos al correo contacto@ejemplo.com o al teléfono 555-1234.');
      return;
    }
    if (lowerCmd.includes('leer preguntas frecuentes')) {
      speak('Abriendo preguntas frecuentes.');
      if (navigate) navigate('/faq');
      return;
    }
    // --- Comandos de carrito y pedido ampliados ---
    if (lowerCmd.includes('agregar') && lowerCmd.includes('al carrito')) {
      speak('Producto agregado al carrito.');
      // Aquí deberías agregar el producto real al carrito
      return;
    }
    if (lowerCmd.includes('eliminar') && lowerCmd.includes('del carrito')) {
      speak('Producto eliminado del carrito.');
      // Aquí deberías eliminar el producto real del carrito
      return;
    }
    if (lowerCmd.includes('vaciar carrito')) {
      speak('Carrito vaciado.');
      // Aquí deberías vaciar el carrito real
      return;
    }
    if (lowerCmd.includes('confirmar compra') || lowerCmd.includes('confirmar pedido')) {
      speak('Compra confirmada.');
      // Aquí deberías confirmar el pedido real
      return;
    }
    if (lowerCmd.includes('cancelar pedido')) {
      speak('Pedido cancelado.');
      // Aquí deberías cancelar el pedido real
      return;
    }
    if (lowerCmd.includes('ver estado del pedido') || lowerCmd.includes('leer estado del pedido')) {
      speak('El estado de tu pedido es: en preparación.');
      // Aquí deberías leer el estado real del pedido
      return;
    }
    // --- Comandos de accesibilidad ampliados ---
    if (lowerCmd.includes('activar modo oscuro')) {
      setColorMode('high-contrast');
      speak('Modo oscuro activado.');
      return;
    }
    if (lowerCmd.includes('desactivar modo oscuro')) {
      setColorMode('normal');
      speak('Modo oscuro desactivado.');
      return;
    }
    if (lowerCmd.includes('aumentar contraste')) {
      setColorMode('high-contrast');
      speak('Contraste aumentado.');
      return;
    }
    if (lowerCmd.includes('reducir contraste')) {
      setColorMode('normal');
      speak('Contraste reducido.');
      return;
    }

    // --- Comando no reconocido ---
    speak('Comando no reconocido. Di "ayuda" para ver los comandos disponibles.');
  }, [speak, vibrate, fontSize, setColorMode, setFontSize, setShowColorPanel, stopListening]);

  // Alternar asistente de voz
  const toggleVoiceAssistant = useCallback(() => {
    const newState = !voiceAssistant;
    setVoiceAssistant(newState);
    
    if (newState) {
      speak('Asistente de voz activado. Di "ayuda" para ver los comandos disponibles.', true);
      vibrate();
    } else {
      stopListening();
      if (speechSynthesis && speechSynthesis.speaking) {
        speechSynthesis.cancel(); // Detener cualquier voz activa
      }
      speak('Asistente de voz desactivado.', true);
      vibrate();
    }
  }, [voiceAssistant, speak, vibrate, stopListening, speechSynthesis]);

  // Inicializar Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'es-ES';
      
      recognition.onstart = () => {
        setIsListening(true);
        speak('Te escucho. Di un comando.', true);
        vibrate();
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        handleVoiceCommand(transcript, null);
      };
      
      recognition.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        setIsListening(false);
        speak('Hubo un error con el asistente de voz. Intenta de nuevo.');
        vibrate([200, 100, 200]);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setSpeechRecognition(recognition);
    }

    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  // Aplicar cambios de accesibilidad al DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover clases anteriores
    root.classList.remove('deuteranopia', 'protanopia', 'tritanopia', 'high-contrast');
    
    // Aplicar nueva clase
    if (colorMode !== 'normal') {
      root.classList.add(colorMode);
    }
    
    // Aplicar tamaño de fuente
    const fontSizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    };
    
    // Remover clases de tamaño anteriores
    Object.values(fontSizeClasses).forEach(className => {
      root.classList.remove(className);
    });
    
    // Aplicar nuevo tamaño
    if (fontSizeClasses[fontSize]) {
      root.classList.add(fontSizeClasses[fontSize]);
    }
  }, [colorMode, fontSize]);

  const value = {
    colorMode,
    setColorMode,
    fontSize,
    setFontSize,
    voiceAssistant,
    toggleVoiceAssistant,
    isListening,
    startListening,
    stopListening,
    speak,
    handleVoiceCommand,
    vibrate,
    showColorPanel,
    setShowColorPanel,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}; 