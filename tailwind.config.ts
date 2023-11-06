import type { Config } from 'tailwindcss'

const config: Config = {
  prefix: 'vdt-',
  import: "#__next",
  corePlugins: {
    preflight: false
  },
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "light-grayish-blue": "#cee2f2",
        "white-lilac": "#f4f7fa",
        "star-dust": "#9c9ea0"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
