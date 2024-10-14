/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

export default {
	darkMode: "class",
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		screens: {
			'mp': { //mp stands for modern phones that are really long
				'raw': '(min-height: 800px)'
			},
			...defaultTheme.screens,
		},
		extend: {
			colors: {
				gasoline: "#CCE649",
				cream: "#F6F3E6",
				rock: "#2B3333",
				grey: "#6D6D6D"
			},
			fontFamily: {
				futuraBook: ['"Futura PT Book"', 'sans-serif'],
				futuraLight: ['"Futura PT Light"', 'sans-serif'],
				futuraMedium: ['"Futura PT Medium"', 'sans-serif'],
				futuraDemi: ['"Futura PT Demi"', 'sans-serif'],
				futuraHeavy: ['"Futura PT Heavy"', 'sans-serif'],
				futuraBold: ['"Futura PT Bold"', 'sans-serif'],
				futuraExtraBold: ['"Futura PT Extra Bold"', 'sans-serif'],
			},
			strokeWidth: {
				'3': '3px',
			}
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		plugin(function ({addVariant}) {
			addVariant(
				'prose-inline-code',
				'&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))'
			);
		})
	],
};
