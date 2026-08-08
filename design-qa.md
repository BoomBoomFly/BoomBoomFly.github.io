# Browser and Visual Acceptance

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
