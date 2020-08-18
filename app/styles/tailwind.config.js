module.exports = {
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'disabled'],
  },
  plugins: [
    require('@tailwindcss/ui')({

    })
  ],
};
