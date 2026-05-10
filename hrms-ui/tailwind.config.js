/** @type {import('tailwindcss').Config} */
module.exports = {
  // Préfixe tw- pour éviter tout conflit avec Angular Material
  prefix: 'tw-',

  content: [
    './src/**/*.{html,ts}'
  ],

  corePlugins: {
    // Désactivé pour ne pas écraser les styles de base de Angular Material
    preflight: false
  },

  theme: {
    extend: {
      colors: {
        // Réexpose les tokens HRMS comme classes Tailwind
        primary:  'var(--hrms-primary)',
        danger:   'var(--hrms-danger)',
        success:  'var(--hrms-success)',
        warning:  'var(--hrms-warning)',
        muted:    'var(--hrms-muted)',
        card:     'var(--hrms-card)',
        border:   'var(--hrms-border)'
      },
      borderRadius: {
        hrms: 'var(--hrms-radius)'
      },
      boxShadow: {
        sm: 'var(--hrms-shadow-sm)',
        md: 'var(--hrms-shadow-md)',
        lg: 'var(--hrms-shadow-lg)'
      },
      fontFamily: {
        heading: ["'Space Grotesk'", 'sans-serif'],
        body:    ["'Inter'", 'sans-serif']
      }
    }
  },

  plugins: []
};