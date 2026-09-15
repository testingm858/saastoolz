# AdSense Policy Compliance — Fix Report

Branch: `fix/adsense-compliance` (11 commits, based on `master` @ `93123c1`)

## Summary

The audit found one direct, provable contradiction that most likely caused
the AdSense policy flag: the live Privacy Policy stated the site does not
use third-party advertising trackers while AdSense was live and serving ads
sitewide, including on pages with no publisher content. Alongside that,
several tool pages made false "runs entirely in your browser" claims for
tools that actually process on the server (including two that made this
claim about passwords and WiFi credentials specifically), a PDF tool
stripped document permissions without requiring the file's password, and a
few smaller domain/engagement/content issues. All of the below are fixed on
this branch.

## Table of changes

| # | Commit | File(s) | Change | Policy addressed |
|---|--------|---------|--------|-------------------|
| 1 | `26c13f3` | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/page.tsx` | Rewrote Privacy Policy's Third parties/Cookies sections to disclose AdSense and third-party ad cookies, personalization, Google/DAA opt-out links, and an EEA/UK/CH consent-message mention. Added a Terms "Advertising" clause. Removed the bare "GDPR compliant" claim and a false "processes in your browser" homepage claim. | Item A — misrepresentation / privacy disclosure |
| 2 | `0f158ab` | `src/lib/ads/policy.ts` (new), `src/app/page.tsx`, `src/app/tools/page.tsx`, `src/app/tools/ToolsListClient.tsx`, `src/app/tools/[toolId]/page.tsx`, `src/components/AdSlot.tsx` | Added `canShowAds(pathname)` as the single source of truth for ad eligibility (tool pages minus `pdf-unlock`, and blog posts). Removed ads from the homepage and `/tools` index. `AdSlot` now renders nothing instead of an empty "Advertisement" placeholder box when no code is configured. | Item B — ad placement |
| 3 | `1991e36` | `src/tools/pdf/pdf-protect.ts`, `src/lib/file-tools.ts`, `src/app/api/tools/[toolId]/file-dispatch.ts`, `src/lib/tools.ts`, `src/lib/toolGuides.ts` | `unlockPdf()` now always requires and authenticates a password before removing any protection, including the owner-password-only case it previously stripped for free. UI/copy updated to require the password and describe the tool as being for documents you own. | Item E — circumvention risk |
| 4 | `6bf881f` | `src/lib/ads.ts` | `getAdCodes()` returns no ad codes outside `NODE_ENV=production`, so local/non-production environments never render live ad creative. | Item C — dev/test gating |
| 5 | `2305ee8` | `CNAME` (removed) | Deleted a stray GitHub Pages-style `CNAME` file pointing at `www.saastoolz.com`, which contradicted `middleware.ts`'s apex-canonical redirect and had no functional role on this Hostinger-deployed app. | Item D — domain/canonical |
| 6 | `ad98096` | `src/lib/tools.ts`, `src/lib/toolSeo.ts` | Added `processing: 'client' \| 'server'` to every tool in the registry (computed, not hand-typed, from a two-entry client-tool set). `toolSeo.ts`'s intro/meta-description/FAQ generation now branches on it. Fixed the specific false claims in `pdf-merge`, `qr-generator`, `json-formatter`, and `password-generator`. | Item F — processing/storage claims |
| 7 | `884ce73` | `src/lib/toolSeo.ts` | Added hand-written `OVERRIDES` (title, meta description, intro, 4 steps, 6 FAQs) for `pdf-split`, `word-counter`, `loan-calculator` — the 3 of the task's 10 priority tools still on the generic template. | Item G — thin content |
| 8 | `e7183c7` | `src/lib/bot-detect.ts` (new), `src/app/tools/[toolId]/page.tsx`, `src/components/ToolCard.tsx` | The tool-page visits counter no longer increments for bot/crawler or Next.js-prefetch requests (just reads the current count instead). Visit/use counts under 10 are hidden instead of shown as a hollow "0" or single digit. | Item H — engagement counters |
| 9 | `a8627ae` | `src/components/Disclaimer.tsx` (new), `src/app/tools/[toolId]/page.tsx` | Added a reusable medical/financial/legal disclaimer, rendered on Pregnancy, BMI, Calorie, BMR, Loan/EMI, Mortgage, ROI, GST/VAT, Currency, and Contract Builder tool pages. | Item I — YMYL disclaimers |
| 10 | `ef59255` | `src/app/about/page.tsx` | Added a "Who runs SaaSToolz" operator-identity section (placeholders, no invented facts) and fixed the same false "processes instantly, client-side" claim found elsewhere. | Item J — trust/transparency |
| 11 | `daaa47e` | `src/components/AdSenseLoader.tsx` (new), `src/app/layout.tsx` | **Found during live verification, not the original static audit.** The `adsbygoogle.js` loader script in the root layout was loading unconditionally on every page in every environment. Live testing in the dev server showed a real ad request/iframe from `googleads.g.doubleclick.net` rendering on `/tools` — Google Auto Ads can activate from the script's mere presence (valid client ID) with no `<ins>` tag or `push()` call needed, so items B and C's fixes (which only gated our own `AdSlot`/`getAdCodes` path) didn't stop it. The script now loads via a client component that checks both `NODE_ENV === "production"` and `canShowAds(pathname)` before mounting. | Items B & C — ad placement / dev gating (gap in the original fix) |

Items K (affiliate/product content) and L (other red flags — adult content,
media downloaders, AI-detection-bypass tools, hacking tools, fake download
buttons, forced redirects, pop-unders, autoplay) had **no findings** during
the audit — nothing to fix.

## `TODO(owner):` items — you need to fill these in

All in `src/app/about/page.tsx`, "Who runs SaaSToolz" section:

- `[TODO(owner): operator or company name]` — the legal name of the person
  or entity operating SaaSToolz.
- `[TODO(owner): country]` — the country you (or the entity) operate from.

No other facts were invented anywhere in this change set. The About page's
operator email intentionally links to the existing `/contact` page rather
than a new email address, since no verified general-purpose inbox was
available to reuse.

## Verification

- **TypeScript** (`npx tsc --noEmit`): passes clean on this branch, including
  through the new required `processing` field touching all ~174 registry
  entries.
- **Lint** (`npm run lint`): 3 pre-existing errors and 10 pre-existing
  warnings remain, all in files this branch never touches
  (`AnnouncementBanner.tsx`, `FileToolInterface.tsx`,
  `InvoiceGeneratorClient.tsx`, and a handful of `<img>`/unused-var
  warnings elsewhere) — confirmed identical on `master` before any of
  these fixes, so nothing here was introduced or should be fixed as part
  of this change.
- **Build** (`npm run build`): fails during page-data collection with
  `Failed to load external module @napi-rs/canvas-...: Cannot find native
  binding` — confirmed **pre-existing**, reproduced identically on `master`
  with zero fixes applied, so nothing introduced by this branch. Root-caused
  it precisely: it's not the npm optional-dependency bug the error message
  suggests, and not a Turbopack bug either (reproduced the identical failure
  under plain webpack too, and via a direct `node -e "require('@napi-rs/
  canvas')"`). A direct require of the platform binary
  (`@napi-rs/canvas-win32-x64-msvc`) returns: *"An Application Control
  policy has blocked this file"* — **this machine's Windows security policy
  (Application Control / WDAC / endpoint protection) is blocking that
  specific `.node` native binary from loading**, full stop. This is local
  to this one Windows dev machine, unrelated to any code in this repo, and
  won't affect Hostinger's Linux server (no Windows Application Control
  there). Not something fixable from within this session — resolving it
  requires either an exception for that file in this machine's security
  policy (an admin/IT action) or building on a different machine.

## Live verification

Ran `npm run dev` locally and checked the actual rendered site in a browser
(not just the code):

- **Homepage & `/tools` index**: no `adsbygoogle` script, no ad `<iframe>`,
  and no network request to any Google ad domain — confirmed both before
  fixing item 11 (where a live ad *was* loading) and after (clean).
- **Privacy Policy**: renders the new Advertising section, updated third
  parties list, and September 15, 2026 "Last updated" date correctly.
- **Homepage badges**: "GDPR compliant" and "processes in your browser"
  claims are gone, replaced with the accurate copy.
- **`/tools/pdf-unlock`**: password field renders as required (visible
  `*`), no "leave blank" hint, no ad slot on the page.
- **`/tools/word-counter`**: renders the new custom how-to/FAQ content,
  including the accurate "sent to our servers" answer; confirmed the tool
  genuinely POSTs to `/api/tools/word-counter` when run (proving the
  `processing: 'server'` classification is correct, not just copy that
  happens to say so).
- **About page**: renders the new "Who runs SaaSToolz" section with the
  `TODO(owner)` placeholders visible, and the corrected processing claim.
- **Tool execution itself could not be fully verified locally**: running
  word-counter returned a 500 ("Network error"). The dev server log shows
  this is the **same pre-existing `@napi-rs/canvas` native-binding block**
  noted under Build above (this machine's Windows security policy, not code)
  — `route.ts` eagerly imports the whole tool dispatch chain (including a
  PDF-to-image module that needs `@napi-rs/canvas`), so *every*
  `/api/tools/[toolId]` request fails to
  even load the route in this local environment right now, regardless of
  which tool is called. Not caused by this branch; page rendering, ad
  placement, and copy accuracy were all still verifiable and confirmed
  correct despite this.

## Manual steps (do these in order)

1. **Enable Google's certified consent message** — AdSense → Privacy &
   messaging → European regulations. The rewritten Privacy Policy already
   describes this to users; it needs to actually be turned on.
2. **Confirm `ads.txt` status** in AdSense → Sites. The file's contents are
   already correct in the repo (`public/ads.txt`); this just confirms
   Google has re-crawled it.
3. **Set `NEXT_PUBLIC_URL=https://saastoolz.com`** (apex, no `www`) in the
   production hosting environment, matching the domain decision made for
   this fix. Everything in-repo (canonical tags, OG tags, sitemap, robots,
   JSON-LD) already derives from this one variable — nothing else needs to
   change once it's set correctly.
4. **Confirm the site URL registered in AdSense** matches the apex domain
   (`https://saastoolz.com`, not `www`).
5. **Check GA4/analytics traffic-source breakdown for the invoice-generator
   page and its blog post** (~7,000 and ~6,800 visits vs ~50–150 elsewhere).
   Nothing in the shipped application code explains this spike — no
   redirects, auto-reload, cron jobs, or seed scripts touch that page. It's
   worth confirming this isn't invalid/bot traffic before requesting
   review.
6. **This machine's Windows security policy is blocking `@napi-rs/canvas`'s
   native binary** (see Verification above) — not a code issue, and won't
   affect the Linux production server, but it currently blocks building or
   running any server-processed tool locally on this dev machine. If you
   want to smoke-test tool execution here before merging, you (or your IT/
   security admin) would need to allow that specific `.node` file in the
   Application Control policy; otherwise this can be safely ignored and
   verified on the Hostinger server instead.
7. **Manually check the live ad creative itself** — it's admin-managed
   HTML stored in the database (`AdSlot`/`AdFrame`), not visible to static
   code review. Confirm nothing rendered there visually mimics a download
   button or a site control.
8. Deploy, then request review in **AdSense → Policy center**.

## Notes on scope decisions

- **Domain**: unified on the apex (`https://saastoolz.com`) per your
  approval — matches what `middleware.ts` already serves (it redirects
  `www` → apex, and notes `www` currently 522s at the DNS/CDN layer).
- **Tool processing claims**: applied the full-fix scope per your
  approval — every tool in the registry now carries an explicit
  `processing` field, and all intro/FAQ copy is generated from it, not
  just the ~6 tools with confirmed false claims.
- **Ad network mix**: the ad system is admin-managed (any network's HTML
  can be pasted into a slot via `/admin/ads`, stored in the database) —
  this branch enforces *placement* rules (which pages/positions) uniformly
  regardless of which network is configured, but doesn't change or
  restrict which ad networks an admin can use, since that's a content/config
  decision, not a code defect.
- **Two AI tools flagged as borderline during the audit**
  (`ai-youtube-summarizer`, a YouTube video summarizer; `ai-paraphraser`, a
  content rewriter) are both `isPremium: true` and hidden site-wide (their
  categories are excluded from the sitemap and their pages 404), so they
  aren't currently exposed to crawling or users. No change was made to
  either — flagging here per your request to report rather than modify
  anything not explicitly covered by the checklist.
