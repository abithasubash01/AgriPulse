/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0B0F19",
          card: "rgba(17, 24, 39, 0.7)",
          border: "rgba(34, 211, 238, 0.2)",
          green: "#00FF88",
          emerald: "#10B981",
          cyan: "#06B6D4",
          blue: "#3B82F6",
          purple: "#8B5CF6",
          amber: "#F59E0B",
          pink: "#EC4899",
          dark: "#070A12",
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0,255,136,0.2), 0 0 10px rgba(0,255,136,0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0,255,136,0.6), 0 0 30px rgba(6,182,212,0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
