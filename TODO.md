# TODO

Pending polish items for this portfolio site. Tracked here (instead of only in Claude's memory) so it's visible across every machine this repo is checked out on. Remove an item once it's actually implemented — don't just mark it done in prose.

- [ ] **Try different fonts.** Current fonts are Space Grotesk (`--font-heading`) and Inter (`--font-body`), set in `src/styles/global.css`. Explore alternatives.
- [ ] **Clean up GitHub project visibility, or remove the GitHub link.** `home.json` socials currently link to `https://github.com/joelberger76`. Either tidy up what's publicly visible on that profile, or drop the link.
- [ ] **Remove the share/external-link button from Key Initiatives cards.** The top-right "open in new" icon/link in `project-card.astro` should go away.
- [ ] **Add real images and rewritten briefs for each Key Initiative.** `projects.json` entries currently have `images: []` (falls back to `/placeholder.jpeg`) and descriptions lifted close to verbatim from the resume — wants actual visuals and freshly written copy per initiative.
- [ ] **Add a custom domain.** Site currently serves from the default `https://joelberger76.github.io` (GitHub Pages). Set up a custom domain — needs a `CNAME` file in `public/`, DNS records at the registrar, and `siteUrl` in `home.json` (plus `SITE_URL` env var if used in CI) updated to match.
- [ ] **Generate a proper Open Graph image.** `ogImageUrl` in `home.json` is still the generic `/placeholder.jpeg`. Joel's headshot (`src/assets/joel-berger.png`) is 400x400 square and would crop awkwardly at the 1200x630 OG/Twitter-card aspect ratio — needs a purpose-built image.
- [ ] Rename Tech Stack since it covers more than just Tech. Potentially use Core Competencies similar to resume but open to other ideas.
- [ ] Under Work Experience, consider separating department from the job titles.
- [ ] Create favicon