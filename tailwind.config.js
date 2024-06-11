/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".hide-calendar-icon::-webkit-calendar-picker-indicator": {
          display: "none",
        },
        ".hide-calendar-icon": {
          "-moz-appearance": "textfield",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
