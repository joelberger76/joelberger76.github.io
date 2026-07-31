# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page portfolio/CV site built with Astro + Tailwind CSS v4. It's a reusable template ("CareerPortfolio") — content lives in JSON files under `src/data/`, not hardcoded in components, so most customization is data-editing rather than code-editing.

## Commands

```bash
npm run dev       # dev server at localhost:4321
npm run build     # production build to ./dist/
npm run preview   # preview the production build locally
npm run astro ...      # run Astro CLI (e.g. `npm run astro check`)
npm run astro -- --help
```

There is no test suite, lint script, or CI check beyond the build itself. `npm run astro check` (via `@astrojs/check`) is the closest thing to type/template validation. The only GitHub Action (`.github/workflows/`) deploys to GitHub Pages on push to `main` using `withastro/action`, and just runs the standard build.

## Architecture

**Single page, section-based composition.** `src/pages/index.astro` is the only route (besides `robots.txt.ts`). It assembles the page from section components in `src/components/`: `nav`, `home`, `career`, `projects`, `skills`, `contact`, each wrapped by `src/layouts/Layout.astro`.

**Data-driven content, but inconsistently wired.** JSON files in `src/data/` (`home.json`, `career.json`, `projects.json`, `skills.json`) are the source of truth for content. Card/list components (`career.astro`, `projects.astro`, `skills.astro`) import their JSON files directly and statically. Only `index.astro` additionally does a runtime fetch: in production (`import.meta.env.PROD`), if `PUBLIC_API_BASE_URL` is set, it fetches `{BASE_URL}/home` and falls back to `home.json` on failure — but this fetched data only feeds `Layout` props (title/SEO/socials), not the section components below it. Keep this in mind when changing how data flows: adding "live backend" support to a new section means replicating the fetch+fallback pattern yourself, not something inherited from `index.astro`.

**Theming via CSS custom properties + `data-theme` attribute, not Tailwind dark mode classes.** `src/styles/global.css` defines 4 base palettes (`default`, `strategic`, `innovator`, `executive`), each with `-dark`/`-light` variants, selected via `[data-theme="<palette>-<mode>"]` selectors overriding `--color-background`, `--color-accent`, `--color-maintext`, `--color-subtext`, `--color-textrain`. Components consume these as Tailwind theme colors (`bg-background`, `text-accent`, etc. — mapped in the `@theme` block). The active palette family is chosen in `src/config.ts` (`SITE_CONFIG.baseTheme`); light/dark within that family is toggled client-side by `theme-toggle.astro`, which flips the `-dark`/`-light` suffix on `data-theme` and persists to `localStorage('theme')`. `Layout.astro` reads that `localStorage` value inline (before paint) to set the initial `data-theme` and avoid a flash of the wrong theme. When adding a new base palette, it must be added in both `global.css` (both mode variants) and referenced as a valid `baseTheme` string in `config.ts`.

**Image resolution.** Local images in `src/data/*.json` are referenced by filename string (e.g. `"photoUrl": "avatar.jpg"`), not import — `src/utils/images.ts` resolves these at runtime via `import.meta.glob` over `src/assets/*` so Astro's image optimization still applies. Any new image-bearing JSON field needs to go through `resolveAssetImage()` rather than being used as a raw path.

**SEO/meta is centralized in `Layout.astro`**, driven entirely by props threaded from `home.json` (or the fetched equivalent): canonical URL, Open Graph/Twitter tags, and a JSON-LD `Person` schema built from the `socials` array (entries with empty/`#` URLs are excluded from `sameAs`). `siteUrl` can be overridden at build time by the `SITE_URL` env var (see `astro.config.mjs`), which takes precedence over `home.json`'s `siteUrl` — this matters for CI/CD deployments where the domain is injected as a secret rather than committed.

**Env vars** (see `.env.example`): `SITE_URL` (override the canonical/OG domain at build time) works as documented. The live-backend var does not: `.env.example` documents `PUBLIC_API_URL`, but `index.astro` actually reads `import.meta.env.PUBLIC_API_BASE_URL` — a naming mismatch in the current code. If you're touching the fetch/fallback logic, reconcile these rather than assuming either file is authoritative. Neither var is required — the site works fully from local JSON with no env vars set.

## My Preferences
- Writing style
   - Don't use em dashes in any written copy (site content, commit messages, etc.). Use a comma, period, or restructure the sentence instead.
- Version Control
   - Only commit to the repo when asked.
   - Work from the develop branch. Check it out if not active before committing.
   - Do not merge to main from develop unless instructed to do so.
   - When committing, include untracked files.
   - When committing, if there are unstaged changes predating your session, please include them.
   - When committing, you should not push to origin until I tell you to.
- I will run the dev server myself in a separate session with npm run dev. You don't have to start it up yourself.
- I store our shared to-do list in TODO.md. Please create it if it doesn't exist already. To-dos should be deleted once complete, but only after I confirm this is ok.
- I don't always leave Google Chrome running. So feel free to check if it is running before launching your /claude-in-chrome skill.