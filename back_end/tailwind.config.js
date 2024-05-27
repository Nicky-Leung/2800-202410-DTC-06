/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['views/**/*.{html,ejs,js}', 'public/**/*.js'],
  theme: {
    extend: {
      backdropBlur: {
        'none': '0',
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      
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

