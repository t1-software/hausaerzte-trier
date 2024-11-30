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
        gulfstream2: {
        '50': '#f1f8f2',
        '100': '#dcefdc',
        '200': '#bcdebe',
        '300': '#90c597',
        '400': '#6faf79',
        '500': '#3f8a4d',
        '600': '#2d6e3b',
        '700': '#245830',
        '800': '#1f4628',
        '900': '#1a3a23',
        '950': '#0e2013',
    },
    'gulfstream': {
        '50': '#f4f6f3',
        '100': '#e7eae1',
        '200': '#cfd5c5',
        '300': '#acb89d',
        '400': '#899977',
        '500': '#647752',
        '600': '#4c5e3d',
        '700': '#3c4b31',
        '800': '#313c29',
        '900': '#293222',
        '950': '#171c12',
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