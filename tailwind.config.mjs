/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				gasoline: "#CCE649",
				cream: "#F6F3E6",
				rock: "#2B3333",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
