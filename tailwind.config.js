/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#F7F8FA",
        ink: "#1B2430",
        muted: "#5B6676",
        line: "#E3E7ED",
        bubble: "#EEF0F5",
        indigo: "#2F3E9E",
        turmeric: "#D9A21B",
      },
      fontFamily: {
        sans: ['"Public Sans"', '"Noto Sans Tamil"', '"Noto Sans Devanagari"', "system-ui", "sans-serif"],
        serif: ['"Source Serif 4"', '"Noto Sans Tamil"', '"Noto Sans Devanagari"', "Georgia", "serif"],
      },
      borderRadius: {
        ui: "8px",
      },
    },
  },
  plugins: [],
};
