/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        background: "#1f2937",
        text: "#f3f4f6",
      },
    },
  },
  darkMode: "class",
  plugins: [],
}

