/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores base accesibles
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        // Colores para deuteranopia (daltonismo rojo-verde)
        deuteranopia: {
          primary: '#0066cc',
          secondary: '#ff9900',
          accent: '#cc6600',
          background: '#f0f8ff',
          text: '#003366',
        },
        // Colores para protanopia
        protanopia: {
          primary: '#0066cc',
          secondary: '#ffcc00',
          accent: '#cc6600',
          background: '#f0f8ff',
          text: '#003366',
        },
        // Colores para tritanopia
        tritanopia: {
          primary: '#cc0066',
          secondary: '#00cc66',
          accent: '#6600cc',
          background: '#fff0f8',
          text: '#660033',
        },
        // Alto contraste
        highContrast: {
          primary: '#ffffff',
          secondary: '#000000',
          accent: '#ffff00',
          background: '#000000',
          text: '#ffffff',
        }
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 