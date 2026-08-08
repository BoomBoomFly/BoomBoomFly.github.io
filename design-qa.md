# Dark Surface Color QA

- Date: `2026-08-09` (`Asia/Shanghai`)
- Source visual truth: `qa-artifacts/references/theme-dark-mismatch-reference.png`
- Implementation screenshot: `qa-artifacts/screenshots/theme-dark-unified-home.png`
- Full-view comparison: `qa-artifacts/comparisons/theme-dark-unified-comparison.png`
- Source pixels: `1439 × 481`; implementation pixels: `1439 × 481`
- CSS viewport: `1439 × 481`; density: `1×`; no density scaling applied
- State: homepage, dark theme, `TEAM / JOIN` closing cards

## Findings and comparison history

1. Initial P2: the source screenshot showed the page background at `rgb(25, 26, 27)` while the JOIN card used `rgb(32, 34, 36)`, creating an unintended split surface.
2. Fix: dark `--surface` and `--color-surface-strong` now both resolve to `#191A1B`.
3. Post-fix evidence: body and explicit card surface both compute to `rgb(25, 26, 27)`; the transparent card inherits the same value. No console errors or warnings were reported.

## Fidelity surfaces

- Fonts and typography: unchanged; outside the requested color correction.
- Spacing and layout rhythm: unchanged. The user capture and browser capture use different scroll crops, so layout was not judged from their outer margins.
- Colors and visual tokens: P2 mismatch resolved; both cards now share the requested solid dark background.
- Image quality and assets: no image assets are present in the compared region.
- Copy and content: unchanged.
- Focused region: computed background values were used because the requested defect is a flat-color mismatch; no additional crop was required.

## Verification

- Browser interaction: light-to-dark theme switch and persistent theme state tested.
- Browser console: no errors or warnings.
- Browser regression: `37/37` passed.
- Automated accessibility: `12/12` passed.
- Astro diagnostics: `21` files, `0` errors, `0` warnings, `0` hints.
- Production build: passed; `22` pages generated.

## Final result

`passed`

---

# Previous Theme Visual QA

- Date: `2026-08-09` (`Asia/Shanghai`)
- Implementation: `E:\BoomBoomfly_workspace\website`
- Browser: Codex in-app browser
- Viewport: `1280 × 720`
- Reference images: `qa-artifacts/references/theme-light-reference.png` (`858 × 435`) and `qa-artifacts/references/theme-dark-reference.png` (`214 × 216`)
- Implementation evidence: `qa-artifacts/screenshots/theme-light-join.png` and `qa-artifacts/screenshots/theme-dark-join.png`
- Comparison boards: `qa-artifacts/comparisons/theme-light-comparison.png` and `qa-artifacts/comparisons/theme-dark-comparison.png`

## Scope

The references define the color system only. Typography, spacing, layout, copy, and assets remain unchanged.

- Light theme: white `#FFFFFF`, ink `#101820`, accent `#1F5D7A`.
- Dark theme: page background `#191A1B`; readable text, border, surface, and accent variants are derived from it.

## Comparison method

- Browser density: `1×`.
- Light comparison: implementation resized to `858` px wide and cropped to `858 × 435` beside the reference.
- Dark comparison: the solid `#191A1B` reference swatch expanded to `858 × 435` beside the implementation.
- Focused check: computed body, text, sidebar, accent, and border colors in both Astro and Starlight views.
- No layout-region crop was required because layout was outside the requested scope.

## Results

- Light body and Starlight sidebar: `rgb(255, 255, 255)`; text: `rgb(16, 24, 32)`.
- Dark body and Starlight sidebar: `rgb(25, 26, 27)`; text: `rgb(245, 246, 247)`.
- Theme controls switched both views correctly and persisted the selected state.
- Browser console: no errors or warnings.
- Light contrast: primary text `17.89:1`, muted text `8.03:1`, accent `7.23:1`, accent-button text `7.23:1`.
- Dark contrast: primary text `16.11:1`, muted text `8.33:1`, accent `6.59:1`, accent-button text `6.76:1`.

## Findings

- P0: none.
- P1: none.
- P2: none.
- P3: the dark reference provides only the background swatch; `#5AA9C7` is used as the derived accent to retain contrast and theme identity.

One implementation pass was sufficient; no P0–P2 corrections were required.

## Verification

- Public-content validation: `11` generated pages, `3` assets, `28` legacy URLs.
- Astro diagnostics: `21` files, `0` errors, `0` warnings, `0` hints.
- Production build: passed; `22` pages generated.

## Final result

`passed`

---

# Previous Browser and Visual Acceptance

- Acceptance date: `2026-08-08` (`Asia/Shanghai`)
- Reference: `E:\BoomBoomfly_workspace\prototypes\color-theme-preview\index.html`, `aviation` palette
- Implementation: `E:\BoomBoomfly_workspace\website`
- Browser fallback: standalone Playwright with installed Chrome, explicitly approved after the in-app browser rejected local URLs
- Viewports: desktop `1440 × 1100`, tablet `768 × 1024`, mobile `390 × 844`
- Evidence: `qa-artifacts/screenshots/`
- Migration pages inspected: legacy laboratory introduction (desktop) and UWB guide (mobile)

## Visual comparison

The reference and implementation were captured in the same Chromium runtime at matching viewport sizes. The accepted screenshots preserve the aviation-cool-silver palette, editorial section markers, display typography, headline wrapping, CTA hierarchy, borders, and generous whitespace.

Expected implementation differences:

- The production site replaces the prototype palette selector with a persistent light/dark theme control.
- Tablet and mobile use a compact menu instead of keeping the full prototype navigation visible.
- The production homepage continues beyond the reference hero into the approved `01–05` content sequence.
- The production header uses the approved accent treatment on the source logo while keeping the SVG source unchanged.

No clipped content, broken images, horizontal page overflow, blank captures, or incorrect viewport states were found in the accepted evidence.

The migrated archive adds two accepted screenshots: `legacy-lab-introduction-desktop.png` and `legacy-uwb-mobile.png`. Manual in-app browser inspection confirmed one page-level H1, visible historical notices, intact images, a responsive single-column mobile layout, keyboard-focusable horizontally scrolling code blocks, and the expected old-URL redirect destination.

## Issues found and fixed

1. Theme switching transitioned the page background after text colors had already changed, briefly producing very low contrast. The body background now switches immediately while local interaction animations remain intact.
2. The active Starlight sidebar item used white text on a white active background in dark mode. It now uses the palette's on-accent text token and is readable in the open mobile sidebar.
3. Browser assertions were narrowed to user-visible main content and semantic controls so Astro's development toolbar and hidden Starlight controls do not create false failures.
4. Sidebar checks now run on a standard Starlight document page; the knowledge landing page intentionally uses the sidebar-free `splash` template.
5. Long migrated C++ code blocks were horizontally scrollable but not keyboard-focusable. Starlight now assigns `tabindex="0"` to rendered code scroll regions at page load, including client-side navigations.

## Verification

- Public-content validation: `13` generated pages, `3` assets, and `15` legacy URLs passed ownership, hash, link, route, and boundary checks.
- Astro diagnostics: `21` files, `0` errors, `0` warnings, `0` hints.
- Production build: passed; `24` content pages plus legacy redirect outputs, Pagefind search index, and sitemap generated.
- Browser acceptance: `48/48` passed.
  - `36` route, redirect, metadata, interaction, focus, theme, navigation, and reduced-motion checks.
  - `12` automated WCAG A/AA checks, including migrated desktop/mobile pages and the open dark-mode mobile Starlight sidebar.
- Visual evidence: `5/5` passed; reference and implementation captured at three target viewports, with dark theme, mobile navigation, Starlight sidebar, and migrated desktop/mobile archive pages inspected.

Automated Axe checks do not establish full WCAG conformance. Screen-reader behavior, high zoom beyond the tested responsive viewports, and human content comprehension remain manual-review concerns.

## Final result

`passed`
