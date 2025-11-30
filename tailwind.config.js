/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    { pattern: /bg-(red|blue|green|yellow|purple|pink|gray|indigo)-[0-9]{3}/ },
    { pattern: /text-(red|blue|green|yellow|purple|pink|gray|indigo)-[0-9]{3}/ }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}