import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Windows 11 Dark Theme
        background: '#202020',
        surface: '#2b2b2b',
        'surface-hover': '#323232',
        'surface-active': '#3a3a3a',
        border: '#3f3f3f',
        text: '#f0f0f0',
        'text-secondary': '#b0b0b0',
        // YouTube Red
        'youtube-primary': '#FF0000',
        'youtube-hover': '#CC0000',
        'youtube-light': '#FF3333',
        // SoundCloud Orange
        'soundcloud-primary': '#FF5500',
        'soundcloud-hover': '#CC4400',
        'soundcloud-light': '#FF7733',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'windows': '0 8px 16px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config
