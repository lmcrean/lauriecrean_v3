/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./docs/**/*.mdx",
    "./blog/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom colors to match your existing theme
        // For example, to match Docusaurus primary color:
        primary: 'var(--ifm-color-primary)',
        'primary-dark': 'var(--ifm-color-primary-dark)',
        'primary-darker': 'var(--ifm-color-primary-darker)',
        'primary-darkest': 'var(--ifm-color-primary-darkest)',
        'primary-light': 'var(--ifm-color-primary-light)',
        'primary-lighter': 'var(--ifm-color-primary-lighter)',
        'primary-lightest': 'var(--ifm-color-primary-lightest)',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  // This ensures Tailwind classes don't conflict with any existing styles
  important: true,
  // Don't purge Docusaurus-specific classes
  safelist: [
    /^docusaurus-/,
    /^navbar-/,
    /^footer-/,
    /^pagination-/,
    /^menu-/,
    /^header-/,
    /^table-of-contents/,
  ],
};

