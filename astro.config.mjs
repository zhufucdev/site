// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

import solidJs from "@astrojs/solid-js";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    locales: ["en", "zh", "zh-tw"],
    defaultLocale: "en",
  },

  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [solidJs(), mdx()],
});

