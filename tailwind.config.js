module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface:    'var(--color-surface)',
        card:       'var(--color-card)',
        border:     'var(--color-border)',
        foreground: 'var(--color-foreground)',
        muted:      'var(--color-muted)',
        accent:     'var(--color-accent)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
