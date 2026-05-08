/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#0f172a",
          lighter: "#1e293b",
          border: "rgba(255, 255, 255, 0.1)",
        },
        primary: "#3b82f6",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

