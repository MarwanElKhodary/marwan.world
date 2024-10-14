import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

export default defineConfig({
  markdown: {
    shikiConfig: {
      themes: {
        light: 'everforest-light',
        // light: 'rose-pine-dawn',
        // light: 'solarized-light',
        // light: 'vitesse-light',
        dark: "everforest-dark",
      },
      wrap: true,
    },
  },
  output: "server",
  adapter: netlify(),
  integrations: [tailwind()],
});
