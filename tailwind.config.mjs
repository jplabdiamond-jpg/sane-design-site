/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        border: 'var(--color-border)',
        accent: 'var(--color-accent)',
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Times New Roman', 'Noto Serif JP', 'serif'],
      },
      maxWidth: {
        content: '1440px',
      },
      borderRadius: {
        DEFAULT: '0px',
      },
    },
  },
  plugins: [],
};
