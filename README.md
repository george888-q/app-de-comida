# 🍽️ ComidaAccesible - Aplicación de Comida Accesible

La primera aplicación de comida diseñada específicamente para personas con discapacidad visual y daltonismo. Navega, ordena y disfruta sin barreras.

## ✨ Características Principales

### 🎤 Asistente de Voz Inteligente
- **Comandos de voz naturales**: "Buscar pizza", "Agregar al carrito", "Confirmar pedido"
- **Control de accesibilidad**: "Cambiar modo deuteranopia", "Subir tamaño de letra"
- **Navegación por voz**: "Ir a restaurantes", "Ver carrito", "Leer ingredientes"
- **Reconocimiento de voz en tiempo real** con Web Speech API

### 👁️ Modos de Color para Daltonismo
- **Deuteranopia**: Para daltonismo rojo-verde
- **Protanopia**: Para daltonismo rojo-verde severo  
- **Tritanopia**: Para daltonismo azul-amarillo
- **Alto Contraste**: Fondo negro, texto blanco
- **Cambio instantáneo** sin recargar la página

### ⌨️ Navegación Completa por Teclado
- **Navegación con Tab**: Todos los elementos son accesibles
- **Indicadores de foco claros**: Bordes azules visibles
- **Atajos de teclado**: Enter, Espacio, Flechas
- **Escape para cerrar modales**

### 📱 Compatibilidad con Lectores de Pantalla
- **Etiquetas ARIA completas**: roles, aria-label, aria-describedby
- **Estructura semántica**: headers, landmarks, listas
- **Descripciones detalladas**: Información contextual
- **Navegación por encabezados**: H1, H2, H3, etc.

### 🛒 Funcionalidades de Comida
- **Exploración de restaurantes** con filtros accesibles
- **Menús detallados** con ingredientes y alérgenos
- **Carrito de compras** con controles de cantidad
- **Checkout seguro** con múltiples métodos de pago
- **Seguimiento de pedidos** en tiempo real
- **Historial completo** de compras

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/comida-accesible.git
cd comida-accesible
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo**
```bash
npm start
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

### Scripts Disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm run build      # Construye la aplicación para producción
npm test           # Ejecuta las pruebas
npm run eject      # Expone la configuración de webpack
```

## 🎯 Cómo Usar la Aplicación

### Activación del Asistente de Voz

1. **Busca el botón de micrófono** en la parte superior derecha
2. **Haz clic para activar** el asistente de voz
3. **Di "ayuda"** para escuchar los comandos disponibles
4. **Usa comandos naturales** como:
   - "Buscar pizza"
   - "Agregar al carrito"
   - "Confirmar pedido"
   - "Cambiar modo deuteranopia"

### Panel de Accesibilidad

1. **Busca el botón de configuración** (⚙️) en la esquina inferior derecha
2. **Selecciona el modo de color** que necesites
3. **Ajusta el tamaño de letra** según tus preferencias
4. **Activa/desactiva** el asistente de voz

### Navegación por Teclado

- **Tab**: Navegar entre elementos
- **Enter/Espacio**: Activar botones y enlaces
- **Flechas**: Navegar en listas y menús
- **Escape**: Cerrar modales y paneles

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.js       # Navegación principal
│   ├── Footer.js       # Pie de página
│   ├── AccessibilityPanel.js  # Panel de configuración
│   └── VoiceAssistant.js      # Asistente de voz
├── contexts/           # Contextos de React
│   ├── AccessibilityContext.js # Estado de accesibilidad
│   └── CartContext.js          # Estado del carrito
├── pages/              # Páginas de la aplicación
│   ├── Home.js         # Página de inicio
│   ├── Restaurants.js  # Lista de restaurantes
│   ├── RestaurantDetail.js # Detalle del restaurante
│   ├── Cart.js         # Carrito de compras
│   ├── Checkout.js     # Proceso de pago
│   ├── Orders.js       # Historial de pedidos
│   └── OrderDetail.js  # Detalle del pedido
├── data/               # Datos simulados
│   └── mockData.js     # Restaurantes, productos, etc.
└── index.css           # Estilos globales
```

## 🎨 Tecnologías Utilizadas

- **React 18**: Framework principal
- **React Router**: Navegación entre páginas
- **Tailwind CSS**: Estilos y diseño responsivo
- **Web Speech API**: Reconocimiento y síntesis de voz
- **Lucide React**: Iconos accesibles
- **LocalStorage**: Persistencia de datos

## 🔧 Configuración de Accesibilidad

### Variables CSS Personalizables

```css
:root {
  --font-size-base: 1rem;
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --spacing-button: 0.75rem 1.5rem;
  --border-radius: 0.5rem;
}
```

### Modos de Color

```javascript
// Deuteranopia
.deuteranopia {
  --color-primary: #0066cc;
  --color-secondary: #ff9900;
  --color-background: #f0f8ff;
}

// Alto Contraste
.high-contrast {
  --color-primary: #ffffff;
  --color-background: #000000;
  --color-text: #ffffff;
}
```

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

### Lectores de Pantalla
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ VoiceOver (macOS/iOS)
- ✅ TalkBack (Android)
- ✅ Orca (Linux)

## 🧪 Pruebas de Accesibilidad

### Herramientas Recomendadas
- **axe-core**: Auditoría automática
- **Lighthouse**: Puntuación de accesibilidad
- **WAVE**: Evaluación web
- **NVDA**: Pruebas con lector de pantalla

### Checklist de Accesibilidad
- [ ] Navegación completa por teclado
- [ ] Etiquetas ARIA apropiadas
- [ ] Contraste de colores adecuado
- [ ] Textos alternativos en imágenes
- [ ] Estructura de encabezados
- [ ] Indicadores de foco visibles

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Subir carpeta build/ a Netlify
```

### GitHub Pages
```bash
npm run build
# Configurar GitHub Actions para deploy automático
```

## 🤝 Contribuir

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Guías de Contribución
- Mantén la accesibilidad como prioridad
- Prueba con lectores de pantalla
- Verifica la navegación por teclado
- Documenta nuevas funcionalidades

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: soporte@comidaaccesible.com
- **Teléfono**: +34 123 456 789
- **Documentación**: [docs.comidaaccesible.com](https://docs.comidaaccesible.com)

## 🙏 Agradecimientos

- Comunidad de accesibilidad web
- Usuarios beta con discapacidad visual
- Desarrolladores de herramientas de accesibilidad
- Restaurantes colaboradores

---

**Hecho con ❤️ para hacer la comida accesible para todos** 