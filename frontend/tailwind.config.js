/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF8F6',
          100: '#F7EDE8',
          200: '#F2DDD3',
          300: '#E4BDB0',
          400: '#D69485',
          500: '#C26D5C', // warm rose
          600: '#AB5444',
          700: '#8A3E31',
          800: '#6E3228',
          900: '#542720',
        },
        plum: {
          50: '#FAF5FA',
          100: '#F2E8F2',
          200: '#E5D0E6',
          300: '#CEACD1',
          500: '#8A508F',
          700: '#5C2D61',
          800: '#471F4B',
          900: '#341537',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E5ECE7',
          200: '#C9D9CD',
          300: '#A7C1AD',
          500: '#698F73',
          700: '#46664F',
          800: '#334D3B',
        },
        lavender: {
          50: '#F7F6FA',
          100: '#EEECF6',
          200: '#DEDAEB',
          300: '#C4BEDA',
          500: '#8B81B3',
          700: '#63598F',
        },
        warm: {
          bg: '#FAF7F4',
          card: '#FFFFFF',
          cardMuted: '#F6F3EE',
          border: '#EDE7E1',
          textDark: '#2C2523',
          textMuted: '#716864',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(138, 62, 49, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 30px -4px rgba(138, 62, 49, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 25px -5px rgba(194, 109, 92, 0.3)',
      }
    },
  },
  plugins: [],
}
