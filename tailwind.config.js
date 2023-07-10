/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js}', './index.html'],
	theme: {
		extend: {
			colors: {
				// Custom colors
				primary: '#FF0000',
				secondary: '#00FF00',
			},
		},
	},
	plugins: [],
};
