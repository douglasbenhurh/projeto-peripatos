/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-green': '#00453d',
                'brand-white': '#fafafa',
                'brand-yellow': '#faaa31',
                'brand-blue': '#3e4095',
                'brand-red': '#ed3238',
            },
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
                serif: ['"Cinzel Decorative"', 'serif'],
                script: ['"Playlist Script"', 'cursive'],
            },
        },
    },
    plugins: [],
}
