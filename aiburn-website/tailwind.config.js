export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          600: '#9333ea',
          700: '#7e22ce',
        },
        blue: {
          600: '#2563eb',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          600: '#475569',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
