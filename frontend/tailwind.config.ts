import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        tertiary: '#808080',
        neutral: '#000000',
        surface: '#FFFFFF',
        'on-surface': '#000000',
        error: '#000000',
        border: '#000000',
        muted: '#808080',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        code: ['Fira Code', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'headline-display': ['45px', { lineHeight: '54px', fontWeight: '700', letterSpacing: '-2px' }],
        'headline-lg': ['35px', { lineHeight: '42px', fontWeight: '400', letterSpacing: '1.5px' }],
        'headline-md': ['27px', { lineHeight: '32px', fontWeight: '400', letterSpacing: '0.16px' }],
        'headline-sm': ['21px', { lineHeight: '25px', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-md': ['16px', { lineHeight: '24px', letterSpacing: '3px' }],
        'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '2px' }],
        'label-lg': ['16px', { lineHeight: '24px' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '1.5px' }],
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '3px' }],
        'code-md': ['16px', { lineHeight: '24px' }],
      },
      borderRadius: {
        button: '8px',
        card: '8px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
