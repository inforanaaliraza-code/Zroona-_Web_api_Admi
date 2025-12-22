/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'tajawal': ['Tajawal', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-green": "#a3cc69",
        "brand-pastel-gray": "#c0b6e1",
        "brand-gray-green-1": "#a1bf89",
        "brand-pastel-gray-purple-1": "#b0a0df",
        "brand-white": "#ffffff",
        "brand-gray-green-2": "#759259",
        "brand-light-orange-1": "#ece8e7",
        "brand-gray-purple-2": "#a797cc",
        "brand-gray-green-3": "#9fb68b",
        "brand-light-orange-2": "#f4ede4",
        "brand-gray-purple-3": "#a08ec8",
        "brand-orange": "#a797cc",
        primary: {
          DEFAULT: "#a3cc69",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#b0a0df",
          foreground: "#ffffff",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "gradient-xy": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(163, 204, 105, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(163, 204, 105, 0.8)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "shimmer": "shimmer 2s infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "glow": "0 0 20px rgba(163, 204, 105, 0.3)",
        "glow-purple": "0 0 20px rgba(176, 160, 223, 0.3)",
        "glow-green": "0 0 15px rgba(163, 204, 105, 0.4)",
        "glow-secondary": "0 0 15px rgba(176, 160, 223, 0.4)",
        "elevated": "0 10px 40px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
