// @ts-check
import { articleIdByLegacyId } from "./src/legacy";

import { defineConfig } from "astro/config";

import { loadEnv } from "vite";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

import solidJs from "@astrojs/solid-js";

import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

const { PUBLIC_SITE } = loadEnv(
  process.env.NODE_ENV ?? "release",
  process.cwd(),
  "",
);

const defaultLocale = "en";
// https://astro.build/config
export default defineConfig({
  site: PUBLIC_SITE,
  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    locales: ["en", "zh", "zh-tw"],
    defaultLocale,
  },

  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [solidJs(), mdx(), sitemap()],
  redirects: {
    ...Object.fromEntries(
      Object.entries(articleIdByLegacyId).map(([legacyId, [locale, id]]) => [
        `/article/${legacyId}`,
        locale === defaultLocale ? `/article/${id}` : `/${locale}/article/${id}`,
      ]),
    ),
  }
});

