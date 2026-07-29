# TODO

Pending polish items for this portfolio site. Tracked here (instead of only in Claude's memory) so it's visible across every machine this repo is checked out on. Remove an item once it's actually implemented — don't just mark it done in prose.

- [ ] **Try different fonts.** Current fonts are Space Grotesk (`--font-heading`) and Inter (`--font-body`), set in `src/styles/global.css`. Explore alternatives.
- [ ] **Clean up GitHub project visibility, or remove the GitHub link.** `home.json` socials currently link to `https://github.com/joelberger76`. Either tidy up what's publicly visible on that profile, or drop the link.
- [ ] **Add a custom domain.** Site currently serves from the default `https://joelberger76.github.io` (GitHub Pages). Set up a custom domain — needs a `CNAME` file in `public/`, DNS records at the registrar, and `siteUrl` in `home.json` (plus `SITE_URL` env var if used in CI) updated to match.
- [ ] **Generate a proper Open Graph image.** `ogImageUrl` in `home.json` is still the generic `/placeholder.jpeg`. Joel's headshot (`src/assets/joel-berger.png`) is 400x400 square and would crop awkwardly at the 1200x630 OG/Twitter-card aspect ratio — needs a purpose-built image.
- [ ] **Add GoatCounter analytics, production only.** Not implemented anywhere yet. Should follow the same `import.meta.env.PROD` gating pattern `index.astro` already uses for the live-backend fetch, so it doesn't fire during local dev.
- [ ] **Give mobile a dedicated pass.** No specific bugs identified yet — just hasn't had a deliberate mobile review since recent layout changes (Education split, section subtitle removal, etc.). Check spacing, touch targets, and readability end-to-end on a real device or emulator.
- [ ] Consider replacing the mobile toolbar. No concrete complaint yet — just a hunch that the current bottom nav (`nav.astro`, icon+label bar that auto-hides on scroll) might not be the right pattern. Revisit once there's a specific reason to change it.