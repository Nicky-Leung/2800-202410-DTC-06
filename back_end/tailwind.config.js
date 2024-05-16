/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['views/**/*.{html,ejs,js}'],
  theme: {
    extend: {
      colors: {
        'crimson': '#D62839',
        'rose': '#BA324F',
        'dark-blue': '#175676',
        'sky-blue':'#4BA3C3',
        'baby-blue': '#CCE6F4'

      },
    },
  },
  variants: {},
  plugins: [
  ],
}

