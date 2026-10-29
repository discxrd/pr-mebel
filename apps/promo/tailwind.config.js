/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // Расширим пути для лучшего обнаружения классов
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "../../node_modules/@repo/ui/**/*.{js,ts,jsx,tsx,mdx}", // если используется общий ui пакет
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '1560': '1560px', // добавляем специфичный брейкпоинт для этого проекта
      '2xl': '1536px',
      // '3xl': '1920px',
      // '4xl': '2560px', 
    },
    extend: {
      backdropBrightness: {
        65: "0.65",
        70: "0.70",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        accent: "#D24A43",
        dark: {
          100: "#F3F2EE",
          300: "#D9D9D9",
          500: "#C3C3C3",
          600: "#868686",
          700: "#6C6C6C",
          900: "#2E2223",
        },
      },
      container: {
        center: "true",
        padding: {
          DEFAULT: "1.5rem",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};