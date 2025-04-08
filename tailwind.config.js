/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#0A192F',
        'dark-bg': '#121212',
      },
      backgroundColor: {
        'dark-bg': '#121212',
        'deep-blue': '#0A192F',
      },
      textColor: {
        'light': '#FFFFFF',
      },
    },
  },
  plugins: [],
} 