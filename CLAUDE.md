# Golden Oak Painting (GOP) — Claude Operating Instructions

Read this file first. Inspect only the files relevant to the request. Do not run a full repository scan.

## Project

- **Client:** Golden Oak Painting, a licensed and insured painting contractor in Bothell, WA.
- **Service area:** Snohomish and King County, WA, including Bothell, Kirkland, Edmonds, Lynnwood, and Everett.
- **Services:** Interior painting, exterior painting, cabinet refinishing, deck staining, drywall repair.
- **Business claims on the site (client confirmation pending; see known issues):** WA licensed, fully insured, EPA Lead Safe Certified, free estimates, 5-year written warranty (conflicts with 3 years on one page), family-run/locally owned, 24-hour response on estimate requests.
- **Phone:** (425) 725-8134
- **Email:** randy@goldenoakpainting.com

## Local directory

`/Volumes/AI-WORKSPACE/projects/Client Sites/GOP`

Git is connected to `origin` = `https://github.com/contractorarsenal/GOP.git`, branch `main` tracking `origin/main`.

## Tech stack

- Static site: plain HTML, CSS, and vanilla JavaScript.
- No framework, no build step, no package.json, no test suite.
- Cloudflare Worker config (`wrangler.jsonc`) serves static assets from `.` with `worker.js` running first.

## Files

| File | Purpose |
|---|---|
| `index.html` | Homepage (hero, services, reviews, FAQ, estimate CTA) |
| `services.html` | Services detail page |
| `about.html` | About / company page |
| `portfolio.html` | Project portfolio and reviews |
| `contact.html` | Estimate request form (Web3Forms) |
| `privacy.html`, `terms.html` | Legal pages (`noindex`) |
| `styles.css` | Shared styles, including mobile menu and breakpoints (1100, 900, 768, 480px) |
| `script.js` | Hero slideshow, typewriter, lightbox, scroll progress, reveal animation, FAQ |
| `mobile-menu.js` | Hamburger menu behavior |
| `mobile-menu.css` | Placeholder only; mobile menu styles live in `styles.css` |
| `worker.js` | Redirects apex `goldenoakpainting.com` to `www`, passes everything else to assets |
| `wrangler.jsonc` | Cloudflare Worker config (Worker name `goldenoakpainting`) |
| `robots.txt`, `sitemap.xml` | SEO files |
| `.assetsignore` | Keeps `README.md`, `worker.js`, `wrangler.jsonc` out of served assets |

## Forms and lead delivery

- `contact.html` posts to `https://api.web3forms.com/submit` through an inline script that shows success or failure messages.
- The Web3Forms access key is a hidden field in `contact.html`. It is public in the HTML by design. Do not change it without authorization.
- Honeypot field: `botcheck`.
- Failure message directs visitors to call (425) 725-8134.
- Do not submit the form or create test leads.

## Analytics, SEO, and integrations

- Google Analytics 4 (`G-CKF93D8VNG`) is on every page, loaded once with a single `gtag('config')` call. No GTM container.
- Custom GA4 events (implemented locally on branch; not yet deployed; real GA4 delivery unverified): `generate_lead` (`form_id: "contact"`, sent only after a confirmed Web3Forms success), `phone_click` and `email_click` (`link_location` only). No personal data, form values, link text, or URLs are sent. These are not marked as key events in GA4; that decision is pending.
- No Facebook Pixel found (`fbq` is absent).
- Google Fonts (Inter) loaded from `fonts.googleapis.com`.
- Structured data (`HomeAndConstructionBusiness`, `Organization`, `ImageObject`, `VideoObject`, `AggregateRating`) on several pages.
- Canonical URLs use extensionless paths (for example `/contact`).
- Social links: Facebook, Instagram, YouTube, and a Google Business link.
- Footer credit links to `https://contractorarsenal.com` on five pages. Keep unless the client asks otherwise.
- Hero slideshow images are hot-linked from `github.com/user-attachments` in `script.js`. Many other images load from `cdn.prod.website-files.com`.

## Development conventions

- Keep edits minimal and match the existing style: vanilla JS, inline styles already present on pages, shared classes in `styles.css`.
- Do not introduce frameworks, build tooling, or dependencies without approval.
- Check responsive layout at phone width (16px gutters, no horizontal scroll) when changing layout.
- Verify visual changes by opening the page in a browser or the `run` skill. Reading the CSS alone is not verification.

## GitHub and Git workflow

- Repository is public: `contractorarsenal/GOP`. Default branch is `main`.
- Local `.DS_Store` is excluded in `.git/info/exclude` only.
- Git identity is set in repo-local config only. Do not change global Git config.
- Open PRs (as of 2026-10-14 connection setup): #9 (Worker rename to `gop`) and #7 (conflicting rename). Do not merge either without approval.
- Remote branches `update_worker_name_to_gop`, `update_worker_name_to_goldeoakpainting`, `cloudflare/workers-autoconfig`, `claude/fix-mobile-overflow-Bl88v` are older or merged. Do not delete without approval.

## Hosting and deployment

- **GitHub Pages:** Enabled. Legacy build from `main` at `/`. No custom domain set in Pages. Every push to `main` triggers a Pages build and deployment. **Verified.**
- **Cloudflare Workers:** The live domain `www.goldenoakpainting.com` is served through Cloudflare. The apex-to-www 301 matches `worker.js`. **Unverified:** which Worker name is deployed, whether Workers Builds is connected to this repo, and which branch triggers production. Confirm in the Cloudflare dashboard before relying on either.
- Do not treat Cloudflare DNS alone as proof of Cloudflare hosting.
- Do not assume GitHub Pages and Cloudflare Workers use the same production workflow.
- **Repository configuration:** `main` has no `.github/` directory and no custom GitHub Actions workflows. The only workflow run is GitHub's `pages-build-deployment`.
- **Branch previews:** GitHub Pages builds only from `main`, so pushing a feature branch does not create a GitHub Pages preview. Any Cloudflare preview would depend on Workers Builds, which is unverified.
- **Customer-facing site:** A push to `main` triggers the GitHub Pages build (verified). Whether `www.goldenoakpainting.com` is served from GitHub Pages or from the Cloudflare Worker is **unverified**. Treat a push to `main` as possibly customer-facing until the Cloudflare dashboard confirms the serving path.
- The live site currently matches `main` at `59c7920`. Changes on this branch are not live until merged to `main` and the serving path is verified.

## Remote development commands

- **"Check website"**: Read-only inspection. Report findings. Make no changes.
- **"Update website"**: Implement and verify changes locally. Do not commit or push without authorization.
- **"Push live"**: Review Git changes and confirm the production branch and deployment configuration. Run checks relevant to the change. Commit only authorized changes. Push only when safe. Verify the deployment before claiming success.
- **"Status"**: Report current branch, uncommitted changes, latest commit, and known issues.
- **"Refresh context"**: Review recent relevant Git history and documentation. Do not repeat a full repository audit.

## Production safety

- Treat any push to `main` as potentially production-impacting. GitHub Pages deploys from `main` automatically.
- Never force-push.
- Never discard uncommitted changes. Never use `git reset --hard` or `git checkout --` on files with local changes.
- Never merge existing PRs without approval.
- Do not change DNS or Cloudflare configuration without authorization.
- Do not rename the Worker until the deployed Worker name is verified.
- Do not commit secrets or private client information.
- Never claim a deployment succeeded without verifying it (for example, fetch the live URL and compare).

## Known issues (unverified or outstanding; do not fix during setup)

1. **Cloudflare Workers deployment:** Production trigger and deployed Worker name are unverified.
2. **PR #9** proposes renaming the Worker from `goldenoakpainting` to `gop`. Decide only after the deployed name is verified.
3. **PR #7** contains a conflicting rename with a typo (`goldeoakpainting`). Recommend closing, pending approval.
4. **Warranty wording conflict:** Most pages say "5 year written warranty," but `about.html` (around line 207) says the warranty covers defects "for 3 full years." Confirm the correct term with the client.
5. **Sitemap and noindex: FIXED LOCALLY, NOT DEPLOYED.** The `privacy.html` and `terms.html` entries were removed from `sitemap.xml`. The remaining five entries match the canonical URLs. The live `privacy.html` still redirects (307) to `/privacy` until deployed.
6. **External images: OPEN.** Hero slideshow images depend on `github.com/user-attachments`, and many other images depend on `cdn.prod.website-files.com`. These can break if the source changes.
7. **Housekeeping: OPEN.** `.assetsignore` lists `gitignore.txt`, which does not exist. Heavy inline styles make the large HTML files harder to maintain.
8. **Footer credit: OPEN.** Five pages link to `contractorarsenal.com`. Confirm with the client.
9. **Homepage JSON-LD syntax: FIXED LOCALLY, NOT DEPLOYED.** A stray backtick at `index.html:40` made the `HomeAndConstructionBusiness` block unparseable. Removed. All JSON-LD blocks now parse. Valid syntax does not guarantee rich results.
10. **Homepage logo alt text: FIXED LOCALLY, NOT DEPLOYED.** The logo at `index.html:583` sits beside the visible text "Golden Oak," so it has `alt=""`.
11. **Conversion tracking: IMPLEMENTED LOCALLY, NOT DEPLOYED, GA4 DELIVERY UNVERIFIED.** Events are described under Analytics. Tested with mocks only (21 of 21 checks). Real GA4 receipt has not been confirmed.
12. **HTTP serves without HTTPS redirect: OPEN.** `http://www.goldenoakpainting.com/` returns 200 directly. The fix belongs either in a Cloudflare zone setting or in `worker.js`. Not changed. Needs approval and a verified serving path.
13. **Business claims and figures: OPEN (client decisions).** Warranty term (3 vs 5 years, `about.html:207`); actual service areas (schema lists 5 cities, visible text lists more); review source, rating, and count (`aggregateRating` 5.0 / 100 vs "100+" visible); "Top-Rated," "Google Verified," "Financing Available," and "24-hour" proposal wording. Do not align or rewrite these without confirmation.
14. **Responsive review: OPEN.** Layout and overflow at 390, 768, and 1440px have not been visually verified. The browser tooling was unavailable during the audit.
