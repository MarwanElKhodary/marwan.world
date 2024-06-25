import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "dracula-soft",
      // themes: { //need to figure out how dark mode works before adding these themes
      //   light: 'rose-pine-dawn',
      //   dark: "slack-dark",
      // },
      wrap: true,
    },
  },
  output: "server",
  adapter: netlify(),
  integrations: [tailwind()],
});
