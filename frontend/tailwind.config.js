/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spooky-dark': '#0a0a0f',
        'spooky-purple': '#2d1b4e',
        'spooky-orange': '#ff6b35',
        'spooky-green': '#4caf50',
        'spooky-yellow': '#ffd700',
        'ghost-white': '#f8f8ff',
      },
      fontFamily: {
        'spooky': ['"Creepster"', 'cursive', 'system-ui'],
      },
      animation: {
        'bat-fly': 'batFly 15s ease-in-out infinite',
        'bat-fly-delay': 'batFly 18s ease-in-out 3s infinite',
        'bat-fly-slow': 'batFly 22s ease-in-out 6s infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'wiggle': 'wiggle 6s ease-in-out infinite',
      },
      keyframes: {
        batFly: {
          '0%': { transform: 'translate(-100px, -50px) scale(0.8)', opacity: '0' },
          '10%': { opacity: '0.7' },
          '50%': { transform: 'translate(50vw, 30vh) scale(1)', opacity: '0.9' },
          '90%': { opacity: '0.7' },
          '100%': { transform: 'translate(110vw, -30px) scale(0.8)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { textShadow: '0 0 10px #ffd700, 0 0 20px #ff6b35' },
          '100%': { textShadow: '0 0 20px #ffd700, 0 0 30px #ff6b35, 0 0 40px #ff6b35' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
    },
  },
  plugins: [],
}
