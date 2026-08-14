/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Sky Blue
        primaryHover: '#2563EB',
        secondary: '#F59E0B', // Sunshine Yellow
        secondaryHover: '#D97706',
        accent: '#10B981', // Apple Green
        accentHover: '#059669',
        danger: '#EF4444', // Coral Red
        dangerHover: '#DC2626',
        background: '#F0F9FF', // Light Blue
        cardBg: '#FFFFFF',
        textDark: '#1E293B',
        // Vibrant Kids Theme Colors
        pinky: '#EC4899',
        purpley: '#8B5CF6',
        cyany: '#06B6D4',
      },
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        '3d': '0 4px 0 0 rgba(0,0,0,0.2)',
        '3d-hover': '0 2px 0 0 rgba(0,0,0,0.2)',
        '3d-active': '0 0px 0 0 rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [],
}
