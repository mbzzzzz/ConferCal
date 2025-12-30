/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#7f13ec",
        "primary-hover": "#6b10c6", // inferred
        "background-light": "#f7f6f8",
        "background-dark": "#191022",
        "card-light": "#FFFFFF",
        "card-dark": "#1F2937",
        "surface-dark": "#251c2e",
        "surface-dark-lighter": "#302839",
        "text-light": "#111827",
        "text-dark": "#F9FAFB",
        "subtext-light": "#6B7280",
        "subtext-dark": "#9CA3AF",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
