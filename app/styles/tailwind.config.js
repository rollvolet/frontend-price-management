const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        display: ['Dosis', 'Inter var', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'disabled'],
    display: ['responsive', 'hover', 'group-hover']
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ]
};
