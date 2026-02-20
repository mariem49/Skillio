/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Front Office - Violet Theme
        violet: {
          50: '#F5F3FF',
          100: '#EDE9FE', // Background
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9', // Primary #6C3FC5 (close to this)
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        // Back Office - Dark Navy Theme
        navy: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0', // Text light
          300: '#CBD5E1',
          400: '#94A3B8', // Text muted
          500: '#64748B',
          600: '#475569',
          700: '#334155', // Border
          800: '#1E293B', // Surface
          900: '#0F172A', // Background / Sidebar
          950: '#020617',
        },
        primary: {
          DEFAULT: '#6C3FC5', // Violet Primary
          dark: '#1E3A5F',    // Navy Primary
        },
        secondary: {
          DEFAULT: '#A855F7', // Violet Secondary
          dark: '#1E40AF',    // Navy Secondary
        },
        accent: {
          DEFAULT: '#F59E0B',
          dark: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'DM Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'Sora', 'sans-serif'],
        body: ['DM Sans', 'IBM Plex Sans', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(108, 63, 197, 0.12)',
        'card-hover': '0 8px 32px rgba(108, 63, 197, 0.16)',
      }
    },
  },
  plugins: [],
}
