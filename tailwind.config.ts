import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'powerful': '6px 6px 3px -3px rgba(0,0,0,0.41)',
      },
      animation: {
        fadeIn: 'fadeIn 2s ease-in-out',
        fadeOut: 'fadeOut 2s ease-in-out',
      },
      colors: {
        windowPrimary: '#234234',
        windowHighlight: '#345434',
        buttonPrimary: '#223633',
        buttonHighlight: '#425144',
        buttonHoverPrimary: '#203229',
        buttonHoverHighlight: '#092017'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0'},
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1'},
          '100%': { opacity: '0' },
        },
        fadeOu3333: {
          '0%': { opacity: '1'},
          '100%': { opacity: '0' },
        },
      },
    },
  }
}
export default config
