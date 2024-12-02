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
        'navy-darkest': 'var(--navy-darkest)',
        'navy-dark': 'var(--navy-dark)',
        'navy-medium': 'var(--navy-medium)',
        'navy-light': 'var(--navy-light)',
        'navy-lightest': 'var(--navy-lightest)',
        'accent-gold': 'var(--accent-gold)',
        'accent-red': 'var(--accent-red)',
        'accent-green': 'var(--accent-green)',
      },
    },
  },
  plugins: [],
} 