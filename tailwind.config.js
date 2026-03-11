/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Paleta Primary
        primary: {
          DEFAULT: "#3b82f6",
          light: "#60a5fa",
          dark: "#1e3a8a",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Secondary (nova)
        secondary: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          dark: "#3730a3",
        },
        // Accent (nova)
        accent: {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#b45309",
        },
        // Fundo
        background: {
          DEFAULT: "#f9fafb",
          light: "#f9fafb",
          dark: "#111827",
        },
        // Superfícies (cards)
        surface: {
          DEFAULT: "#ffffff",
          light: "#ffffff",
          dark: "#1f2937",
        },
        // Texto
        text: {
          DEFAULT: "#111827",
          light: "#111827",
          dark: "#f9fafb",
        },
      },
      boxShadow: {
        "game-card": "0 4px 12px rgba(0, 0, 0, 0.12)", // sombra custom
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      transitionProperty: {
        colors:
          "color, background-color, border-color, text-decoration-color, fill, stroke",
      },
    },
  },
  plugins: [],
};
