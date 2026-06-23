/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand tokens — preserved from the original design.
        cream: '#F7F0E6',
        'cream-admin': '#F1EADC',
        'cream-panel': '#EFE6D8',
        accent: '#D9824A',
        'accent-hover': '#C26E38',
        'accent-light': '#E5915A',
        navy: '#21353F',
        ink: '#16242B',
        slate: '#2D4654',
        muted: '#5E6E76',
        warm: '#8a7a66',
      },
      fontFamily: {
        serif: ['Newsreader', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        site: '1340px',
        'site-md': '1320px',
      },
      borderRadius: {
        pill: '999px',
      },
    },
  },
  plugins: [],
};
