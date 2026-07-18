/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF9933', // Vibrant saffron/orange
                    dark: '#E67E00',
                },
                cream: {
                    DEFAULT: '#FFF9F1',
                    dark: '#F5E6D3',
                },
                brown: {
                    DEFAULT: '#3E2723',
                    dark: '#2d1d1a',
                }
            },
            fontFamily: {
                cinzel: ['Cinzel', 'serif'],
                poppins: ['Poppins', 'sans-serif'],
                sans: ['Poppins', 'sans-serif'], // Make Poppins the default
            },
            borderRadius: {
                'asymmetric': '40px 0px 40px 0px',
            }
        },
    },
    plugins: [],
}
