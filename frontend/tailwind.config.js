export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0f172a',
        panel: '#111827',
        accent: '#10b981',
        accentSoft: '#064e3b',
      },
      boxShadow: {
        glass: '0 20px 50px rgba(16, 185, 129, 0.12)',
      },
    },
  },
  plugins: [],
}
