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

import rehypeShiki from "@shikijs/rehype";

import sitemap from "@astrojs/sitemap";
import { defaultLocale } from "./src/locale";

const { PUBLIC_SITE } = loadEnv();

// https://astro.build/config
export default defineConfig({
  site: PUBLIC_SITE,
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: [
          "fsevents",
          ...builtinModules,
          ...builtinModules.map((m) => `node:${m}`),
        ],
      },
    },
  },

  i18n: {
    locales: ["en", "zh", "zh-tw"],
    defaultLocale,
  },
  markdown: {
    rehypePlugins: [[rehypeShiki, { theme: "github-dark" }]],
    syntaxHighlight: false,
  },

  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [
    mermaid({
      theme: "neutral",
      autoTheme: false,
      mermaidConfig: {
        startOnLoad: false,
        logLevel: "error",
        securityLevel: "strict",
      },
    }),
    solidJs(),
    mdx(),
    sitemap(),
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
    ],
  },
});
