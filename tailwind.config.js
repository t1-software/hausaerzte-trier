export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {  
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '2rem' }],
      xl: ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['2rem', { lineHeight: '2.5rem' }],
      '4xl': ['2.5rem', { lineHeight: '3.5rem' }],
      '5xl': ['3rem', { lineHeight: '3.5rem' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1.1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    extend: {
      colors: {
        white: "#ffffff",
        black: "#000000",
        transparent: "transparent",
        current: "currentColor",
        gulfstream: {
          '50': '#f3f8f7',
          '100': '#e0edec',
          '200': '#c5dcdb',
          '300': '#9cc4c4',
          '400': '#7aacac',
          '500': '#518889',
          '600': '#467174',
          '700': '#3d5e61',
          '800': '#384f52',
          '900': '#324447',
          '950': '#1e2c2e',
        },
      },  
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        sans: 'var(--font-inter)',
        display: 'var(--font-lexend)',
      },
      maxWidth: {
        '2xl': '40rem',
      },
    },
  },  
  plugins: []
};