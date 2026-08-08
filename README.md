# BoomBoomFly Website

This directory is the public website repository for Drone Innovation Lab. The first implementation stage provides an Astro landing site, a Starlight knowledge layer, the approved aviation-cool-silver design system, and conservative public routes for research, projects, team, joining, and laboratory background.

## Local development

```bash
npm install
npm run dev
npm run check
npm run build
```

Browser QA is organized under `tests/browser/`. It covers public routes, navigation and theme behavior, Starlight controls, responsive states, automated accessibility checks, and screenshot evidence.

## Content boundary

The private `knowledge-base/` is the only editorial source of truth. The trusted local exporter reads only `knowledge-base/80_Publish/` and exports only notes with:

- `visibility: public`
- `status: ready` or `status: published`

Eligible notes must also pass metadata, asset, link, route, and sensitive-information checks. Public copies flow one way into this repository; they never flow back into the knowledge base.

## Public CI boundary

Public CI must:

1. Check out only the `website` repository.
2. Never receive credentials for, clone, fetch, mount, or read the private knowledge-base repository.
3. Validate only public content, generated-file ownership, links, routes, build output, and other artifacts already committed here.
4. Fail rather than silently skip an invalid or missing public artifact.

Private-source filtering and export therefore happen only in a trusted local workspace before public artifacts are reviewed and committed to this repository.

## Generated publishing paths

- `src/content/docs/knowledge/legacy/`: generated public text content loaded by Starlight.
- `public/images/generated/`: generated public asset copies.
- `generated-content-manifest.json`: ownership, hash, route, and redirect manifest.
- `tools/content-policy.json`: machine-readable publishing contract.
- `tools/validate-generated.mjs`: website-only validation for committed public artifacts.

Generated publishing is active for the reviewed legacy archive. Run `npm run validate:content` inside this repository to validate the committed public copies without reading the private knowledge base.
