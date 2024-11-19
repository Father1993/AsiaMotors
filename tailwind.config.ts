import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './posts/**/*.{md,mdx}',
    ],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: '#333',
                        a: {
                            color: '#3182ce',
                            '&:hover': {
                                color: '#2c5282',
                            },
                        },
                    },
                },
            },
            colors: {
                primary: {
                    DEFAULT: '#FF9100',
                    dark: '#E68200',
                    light: '#FFB04D',
                },
                secondary: {
                    DEFAULT: '#101828',
                    dark: '#0D1421',
                    light: '#1F2937',
                },
            },
            fontFamily: {
                montserrat: ['Asiamotors Montserrat', 'sans-serif'],
                inter: ['Asiamotors Inter', 'sans-serif'],
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '2rem',
                    lg: '4rem',
                    xl: '5rem',
                    '2xl': '6rem',
                },
            },
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
            },
        },
    },
    plugins: [typography],
    darkMode: 'class',
}

export default config
