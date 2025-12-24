/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#FF69B4',
          purple: '#C77DFF',
          green: '#06D6A0',
        },
        accent: {
          orange: '#FF9F1C',
          yellow: '#FFD60A',
          blue: '#4CC9F0',
        },
        background: {
          soft: '#FFF5F8',
          light: '#FFF0F5',
          card: '#FFFAFC',
        },
        text: {
          dark: '#2D3142',
          light: '#9FA2B4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 20px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
