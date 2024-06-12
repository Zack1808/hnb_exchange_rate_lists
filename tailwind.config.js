/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        rotation: {
          "0%": { rotate: "0deg" },
          "100%": { rotate: "361deg" },
        },
      },
      animation: {
        rotation: "rotation 1s linear infinite",
      },
    },
  },
  plugins: [],
};
