# Steve's Blog

## Summary

I post long form articles here.

## Project Structure

This project follows a standard Astro project structure:

- `public/`: Static assets that are copied directly to the build output.
- `src/`: The main source code of the application.
  - `components/`: Reusable UI components.
  - `content/`: Markdown/MDX content collections.
  - `layouts/`: Astro layout components that define the page structure.
  - `pages/`: Files here define the routes of the site. Supports multi-language (e.g., `zh/`, `zh-tw/`).
  - `styles/`: Global CSS and styling configurations.
  - `utils/`: Utility functions and shared logic.
  - `icons/`: Custom icon components.
  - `strings/`: Localized string constants.
- `astro.config.mjs`: Astro configuration file.
- `package.json`: Project dependencies and scripts.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## External Links

- Astro [documentation](https://docs.astro.build) and [Discord server](https://astro.build/chat).
