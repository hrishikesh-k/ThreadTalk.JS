const colors = require('tailwindcss/colors')

function hextoRGBA(hex, alpha) {
  return('rgba(' + parseInt(hex.slice(1, 3), 16) + ', ' + parseInt(hex.slice(3, 5), 16) + ', ' + parseInt(hex.slice(5, 7), 16) + ', ' + alpha + ')')
}

module.exports = {
  darkMode: 'class',
  purge: {
    enabled: process.env.HUGO_ENVIRONMENT === 'production',
    preserveHtmlElements: false,
    content: ['./docs/layouts/**/*.html', './docs/content/**/*.md'],
    options: {
      safelist: ['dark', 'lottie']
    }
  },
  theme: {
    screens: {
      m: '640px',
      l: '1024px'
    },
    fontFamily: {
      'sans': ['Ubuntu', 'sans-serif'],
      'mono': ['Ubuntu Mono', 'monospace']
    },
    colors: {
      red: colors.red,
      gray: colors.gray,
      green: colors.green,
      yellow: colors.amber,
      orange: colors.orange
    },
    boxShadow: {
      dark: '0 0px 5px 1px ' + hextoRGBA(colors.gray[100], 0.25),
      light: '0 0px 5px 1px ' + hextoRGBA(colors.gray[800], 0.25)
    },
    extend: {
      width: {
        'fit': 'fit-content'
      },
      maxHeight: {
        'fit': 'fit-content'
      },
      animation: {
        loading: 'loading 2s ease infinite'
      },
      keyframes: {
        loading: {
          '75%, 100%': {
            transform: 'rotateZ(360deg)'
          }
        }
      },
      transitionProperty: {
        'collapse': 'margin-top, max-height'
      }
    }
  },
  plugins: [require('tailwind-scrollbar')],
  variants: {
    scrollbar: ['dark', 'rounded'],
    extend: {
      boxShadow: ['dark'],
      display: ['group-hover'],
      translate: ['group-hover']
    }
  }
}