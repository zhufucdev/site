// @ts-check
import { builtinModules } from "module";

import { articleIdByLegacyId } from "./src/legacy";

import { defineConfig } from "astro/config";

import loadEnv from "./src/utils/load-env";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

import solidJs from "@astrojs/solid-js";

import mdx from "@astrojs/mdx";

import mermaid from "./astro-mermaid-integration";

import basicSsl from "@vitejs/plugin-basic-ssl";

import sitemap from "@astrojs/sitemap";

import { defaultLocale } from "./src/locale";
import { cookieName, visitTtlSeconds } from "./src/sessions";
const { PUBLIC_SITE } = loadEnv();

// https://astro.build/config
export default defineConfig({
  site: PUBLIC_SITE,
  vite: {
    // @ts-ignore
    plugins: [tailwindcss(), basicSsl()],
    build: {
      rolldownOptions: {
        external: [
          "fsevents",
          ...builtinModules,
          ...builtinModules.map((m) => `node:${m}`),
        ],
      },
    },
    optimizeDeps: {
      exclude: ["mermaid"],
    },
  },

  i18n: {
    locales: ["en", "zh", "zh-tw"],
    defaultLocale,
  },

  adapter: cloudflare({
    imageService: "compile",
  }),
  server: {
    headers: {
      "Access-Control-Allow-Origin": "https://giscus.app",
    },
  },
  session: {
    cookie: {
      name: cookieName,
    },
    ttl: visitTtlSeconds,
  },
  integrations: [
    mermaid(),
    solidJs(),
    mdx(),
    sitemap({
      filter: (page) => {
        const segements = new URL(page).pathname.split("/");
        return (
          segements.findLast((seg) => seg.length > 0)?.startsWith(".") == false
        );
      },
    }),
  ],
  redirects: {
    ...Object.fromEntries(
      Object.entries(articleIdByLegacyId).map(([legacyId, [locale, id]]) => [
        `/article/${legacyId}`,
        locale === defaultLocale
          ? `/article/${id}`
          : `/${locale}/article/${id}`,
      ]),
    ),
  },

  security: {
    allowedDomains: [
      {
        hostname: "**.zhufucdev.com",
        protocol: "https",
      },
      {
        hostname: "giscus.app",
        protocol: "https",
      },
    ],
  },
});
