# Website Rules

This directory is the future public website repository. The current phase is architecture-only: do not add pages, visual design, a framework, dependencies, CI, or deployment unless a later task explicitly requests it.

## Boundaries

- Treat the knowledge base as private and as the only editorial source of truth.
- A trusted local exporter may read only `../knowledge-base/80_Publish/` and only notes with `visibility: public` plus `status: ready` or `status: published`.
- Generated content and assets are public copies. Never use them to overwrite source notes or source attachments.
- Never copy private notes, references, archives, credentials, or unapproved assets into this repository.

## Public CI Boundary

Public CI must check out and operate on this repository alone. It must not clone, fetch, mount, or use credentials to access the private knowledge-base repository. It may validate and deploy only committed public artifacts already present here.

Future content tooling must fail closed when allowlist, metadata, asset, link, route, sensitive-information, or generated-file ownership checks fail.

## Product Ownership

The user owns visual direction, information architecture, content meaning, primary branding, navigation, public URLs, and final approval. Do not independently make those decisions.

## Repository Hygiene

Before changes, inspect Git status and preserve unrelated work. Do not add a remote, commit, push, publish, or deploy without explicit authorization. When the full workspace is available, also read `../AGENTS.md` and `../workspace.config.json`.
