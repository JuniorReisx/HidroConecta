/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#16325c",
        deep: "#102848",
        brand: "#1a4b96",
        tide: "#1498b8",
        mist: "#f5f8fb",
        ink: "#243b5a",
      },
      fontFamily: {
        sans: ["Manrope", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 50px rgba(12, 61, 122, 0.08)",
        soft: "0 10px 30px rgba(12, 61, 122, 0.06)",
      },
    },
  },
  plugins: [],
}
