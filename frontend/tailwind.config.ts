import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#CCFF00',
        secondary: '#E8EDE8',
        tertiary: '#7D8A7D',
        neutral: '#080C08',
        surface: '#101410',
        'on-surface': '#E8EDE8',
        error: '#FF6B6B',
        border: '#374151',
        muted: '#5F6A5F',
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
