/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "550px",
      md: "768px",
      lg: "1080px",
      xl: "1440px",
    },
    colors: {
      white: "#E5F7F3",
      blue: "#1fb6ff",
      pink: "#ff49db",
      orange: "#ff7849",
      green: "#C5FFC3",
      red: "#FFC3C3",
      yellow: "#FFFDC3",
      gray: {
        100: "#302D37",
        200: "#211A1D",
        300: "#2C2932",
        400: "#6E676E",
      },
      purple: {
        100: "#3A5B69",
        200: "#A4CACE",
      },
      200: "#7236EF",
    },
  },

  extend: {
    spacing: {
      128: "60rem",
    },

    gridTemplateColumns: {
      "auto-fill-100": "repeat(auto-fill, minmax(150px, 1fr))",
      "auto-fit-100": "repeat(auto-fit, minmax(150px, 1fr))",
    },
  },
  plugins: [],
};
