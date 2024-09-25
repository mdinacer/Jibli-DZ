/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(220 13% 91%)',
        input: 'hsl(220 13% 91%)',
        ring: 'hsl(224 71.4% 4.1%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(224 71.4% 4.1%)',
        primary: {
          DEFAULT: 'hsl(220.9 39.3% 11%)',
          foreground: 'hsl(210 20% 98%)'
        },
        secondary: {
          DEFAULT: 'hsl(220 14.3% 95.9%)',
          foreground: 'hsl(220.9 39.3% 11%)'
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
          foreground: 'hsl(210 20% 98%)'
        },
        muted: {
          DEFAULT: 'hsl(220 14.3% 95.9%)',
          foreground: 'hsl(220 8.9% 46.1%)'
        },
        accent: {
          DEFAULT: 'hsl(220 14.3% 95.9%)',
          foreground: 'hsl(220.9 39.3% 11%)'
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(224 71.4% 4.1%)'
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(224 71.4% 4.1%)'
        }
      },

      fontFamily: {
        pthin: ['Poppins-Thin', 'sans-serif'],
        pextralight: ['Poppins-ExtraLight', 'sans-serif'],
        plight: ['Poppins-Light', 'sans-serif'],
        pregular: ['Poppins-Regular', 'sans-serif'],
        pmedium: ['Poppins-Medium', 'sans-serif'],
        psemibold: ['Poppins-SemiBold', 'sans-serif'],
        pbold: ['Poppins-Bold', 'sans-serif'],
        pextrabold: ['Poppins-ExtraBold', 'sans-serif'],
        pblack: ['Poppins-Black', 'sans-serif']
      }
    }
  },
  plugins: []
};
