const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/@gohighlevel/ghl-ui/**/*.{js,jsx,ts,tsx,vue}',
    '../../node_modules/@gohighlevel/clientportal-core/dist/*.{js,jsx,ts,tsx,vue}', //Adding it twice for now, later we will remove one
    './node_modules/@gohighlevel/clientportal-core/dist/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'sans-serif',
          'Inter var',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      colors: {
        primary: {
          25: '#F5F8FF',
          50: '#EFF4FF',
          100: '#D1E0FF',
          200: '#B2CCFF',
          300: '#84ADFF',
          400: '#528BFF',
          500: '#2970FF',
          600: '#155EEF',
          700: '#004EEB',
          800: '#0040C1',
          900: '#00359E',
        },
        gray: {
          25: '#FCFDFD',
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#EAECF0',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1D2939',
          900: '#101828',
        },
        success: {
          25: '#f6fef9',
          50: '#ecfdf3',
          100: '#d1fadf',
          200: '#a6f4c5',
          300: '#6ce9a6',
          400: '#32d583',
          500: '#12b76a',
          600: '#039855',
          700: '#027a48',
          800: '#05603a',
          900: '#054f31',
        },
        warning: {
          25: '#fffcf5',
          50: '#fffaeb',
          100: '#fef0c7',
          200: '#fedf89',
          300: '#fec84b',
          400: '#fdb022',
          500: '#f79009',
          600: '#dc6803',
          700: '#b54708',
          800: '#93370d',
          900: '#7a2e0e',
        },
        error: {
          25: '#fffbfa',
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#ffcdca',
          300: '#fda29b',
          400: '#fa7066',
          500: '#f04438',
          600: '#d92d20',
          700: '#b42318',
          800: '#912018',
          900: '#7a271a',
        },
      },
      screens: {
        xs: '376px',
        // => @media (min-width: 376px) { ... }

        sm: '640px',
        // => @media (min-width: 640px) { ... }

        md: '769px',
        // => @media (min-width: 769px) { ... }

        lg: '1024px',
        // => @media (min-width: 1024px) { ... }

        xl: '1400px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '2050px',
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
