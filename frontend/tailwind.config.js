/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "description": "#6b6b6b",
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}

