/** @type {import('tailwindcss').Config} */
// const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./node_modules/@yext/search-ui-react/**/*.{js,ts,jsx,tsx}", // New
  ],
  theme: {
    container: {
      center: true,
    },
    screens: {
      xs: "576px",
      sm: "640px",
      md: "767px",
      lg: "991px",
      xl: "1200px",
      "2xl": "1536px",
    },
    colors: {
      'transparent': 'transparent',
      'white': '#ffffff',
      'black': '#000000',
      'grey': '#716e67',      
      'white-rgba': 'rgba(245, 245, 245, 0.2)',
      'primary-gray': '#404147',
      'search-block-gray': '#2f2f33',
      'primary-pink': '#FF157F',
      'secondary-purple': '#613A64',
      'secondary-sky-blue': '#57BDB8',
      'breadcrumb-sky-blue': '#67c7c5',
      'secondary-yellow': '#FFCC34',
    },
    fontFamily: {
      'Arial': ['"Arial", Georgia, Arial, sans-serif'],
      'Carpetright': ['"Carpetright", Georgia, Arial, sans-serif'],

    },
    extend: {
      backgroundImage: {
        closeIcon: "url('src/images/close.svg')",       
      }
    },
  },
  plugins: [],
};
