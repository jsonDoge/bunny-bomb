module.exports = {
  content: ['./src/**/*.html'],
  // darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
