/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B1220',
          900: '#0F1826',
          800: '#151F30',
          700: '#1C283C',
          600: '#28354C',
          500: '#3A4A66',
        },
        mist: {
          400: '#7C8AA5',
          300: '#9AA6BD',
          200: '#C2CADB',
          100: '#E6EAF2',
        },
        accent: {
          DEFAULT: '#38BDF8',
          dim: '#1B8FC4',
        },
        good: '#34D399',
        bad: '#F87171',
        warn: '#FBBF24',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.3)',
        popover: '0 8px 24px 0 rgb(0 0 0 / 0.4)',
      },
    },
  },
  plugins: [],
};
