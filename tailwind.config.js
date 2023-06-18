const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js',
      'content/**/*.md'
    ]
  },
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: '#47B749',
        secondary: '#2D2D2D',
        'logo-red': '#FF0000',
        'btn-gray': '#3F3F3F',
        'gray-outline': '#797979',
        'dark-gray': '#292929',
        'light-gray': '#E4E4E4',
        'footer-gray': '#797687',
        'footer-light-gray': '#a39eb9',
        'gradient-grey-dark': '#252525',
        'gradient-grey-light': '#424242',
        'dark-blue': '#2B2350',
        'link-blue': '#005abb',
        'light-blue': '#797687',
        'tree-green': '#6ED42F',
        'light-purple': '#EBE7FE',
        'light-gold': '#FFF4DF',
        'dark-gold': '#FDB01A',
        'light-green': '#E6F8EE',
        'dark-green': '#50CD8A',
        'light-pink': '#FEE5EF',
        'dark-pink': '#F64A8F',
        'error-gray': '#f7f7f7'
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans]
      },
      boxShadow: {
        '3xl': '0 15px 20px 10px rgba(43, 35, 80, .12)',
        '3xl-footer': '0 20px 15px 10px rgba(84, 28, 136, .2)',
        '3xl-inner': 'inset 0 15px 20px 10px rgba(43, 35, 80, .12)',
        light: '0 15px 20px 7px rgba(255, 255, 255, .12)',
        card: '0 2px 30px 5px rgba(0, 0, 0, .08)',
        'selected-card': '0 0 0 3px #FF0000'
      },
      borderWidth: {
        6: '6px'
      },
      keyframes: {
        motion: {
          '0%': {
            transform: 'translateY(-8px)'
          },
          '100%': {
            transform: 'translateY(8px)'
          }
        },
        motionReverse: {
          '0%': {
            transform: 'translateY(8px)'
          },
          '100%': {
            transform: 'translateY(-8px)'
          }
        }
      },
      animation: {
        motion: 'motion 1s ease-in-out infinite alternate',
        'motion-reverse': 'motionReverse 1s ease-in-out infinite alternate'
      }
    }
  },
  variants: {
    extend: {
      animation: ['group-hover']
    }
  },
  plugins: []
}
