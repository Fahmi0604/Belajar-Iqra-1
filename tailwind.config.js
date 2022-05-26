const defaultTheme = require('tailwindcss/defaultTheme')
const windmill = require('@windmill/react-ui/config')

module.exports = windmill({
  purge: ['src/**/*.{html,js,jsx,ts,tsx}'],
  media: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        'custom-font': ['Poppins', 'sans-serif'],
        'custom-font-gum': ['Bubblegum Sans', 'cursive']
      },
      colors: {
        'custom-primary': '#4181E2',
        'custom-secondary': '#5098FF',
        'custom-dark': '#2E6DCD',
        'custom-orange': '#FFBE06',
        'custom-text': '#282828',
        'custom-green-primary': '#3FBD82',
        'custom-green-secondary': '#34A46F'
      },
      boxShadow: {
        bottom: '0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)',
        'notclick': '0 4px #5098FF',
        'click': '0 4px #2E6DCD',
        'custom-shadow-green': '0 4px #34A46F',
        'custom-shadow-gray': '0 4px #cecece',
        'custom-shadow-yellow': '0 4px #C38528'
      },
      width: {
        '15%': '15%',
        '23%': '23%',
        '27%': '27.3%',
        '31%': '31.3%',
        '40%': '40%',
        '48%': '48%',
        '60%': '60%',
        '80%': '80%',
        '90%': '90%'
      },
      height: {
        '50vh': '50vh'
      },
      borderWidth: {
        '15': '8px'
      },
      margin: {
        '1%': '1%',
        '2.5%': '2.5%',
        '25%': '25%'
      },
      minHeight: {
        'custom-min-height': '8rem'
      },
      padding: {
        '25%': '25%'
      }
    },
  },
})
