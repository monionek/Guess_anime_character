/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Include all files in the `app` directory
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Include all files in the `components` directory
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Include all files in the `pages` directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};