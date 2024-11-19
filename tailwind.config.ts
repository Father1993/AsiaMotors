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
                        h1: {
                            marginTop: '2rem',
                            marginBottom: '1rem',
                            fontSize: '2.5rem',
                        },
                        h2: {
                            marginTop: '2rem',
                            marginBottom: '1rem',
                            fontSize: '2rem',
                        },
                        h3: {
                            marginTop: '1.5rem',
                            marginBottom: '0.75rem',
                            fontSize: '1.5rem',
                        },
                        p: {
                            marginTop: '1.25rem',
                            marginBottom: '1.25rem',
                        },
                        ul: {
                            marginTop: '1.25rem',
                            marginBottom: '1.25rem',
                        },
                        li: {
                            marginTop: '0.5rem',
                            marginBottom: '0.5rem',
                        },
                        img: {
                            marginTop: '2rem',
                            marginBottom: '2rem',
                            borderRadius: '0.75rem',
                        },
                        table: {
                            marginTop: '2rem',
                            marginBottom: '2rem',
                            borderRadius: '0.75rem',
                            overflow: 'hidden',
                        },
                        a: {
                            color: '#3182ce',
                            textDecoration: 'none',
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
