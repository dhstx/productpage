/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0C0C0C",
        panel: "#1A1A1A",
        accent: "#FFC96C",
        text: {
          primary: "#F2F2F2",
          secondary: "#B3B3B3"
        }
      }
    }
  },
  plugins: []
};
