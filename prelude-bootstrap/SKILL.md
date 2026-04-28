---
name: prelude-bootstrap
description: Bootstrap project prelude files for engineering handoff and multi-window continuity. Use when starting a new repo or when a repo lacks a stable AI-facing knowledge layer such as `ai/prd.md`, `ai/global-rules.md`, `ai/reference/*`, `ai/commands/*`, or `ai/archive/*`. Also use when the user asks to create, normalize, refresh, or standardize prelude files, onboarding docs, handoff docs, workflow docs, or “start-here” project context files.
---

# Prelude Bootstrap

Build or normalize a project-level prelude layer under `project-root/ai` so future agents can resume work fast and safely.

## Workflow

1. Inspect the repo before writing anything.
2. Infer the real stack, main app surfaces, key workflows, shared high-risk files, and existing docs.
3. Reuse existing project docs where possible; do not fork the truth into duplicate files.
4. Create or refresh a minimal `ai/` layer with stable entry files, references, commands, and handoff index.
5. Keep docs short, operational, and path-accurate.

## Required inspection pass

Before creating files, inspect at least:

- Top-level directories and manifests
- App entry files and routing files
- API/client entrypoints
- Backend entrypoints/controllers/services if present
- Existing docs under `doc/`, `docs/`, `ai/`, or similar
- Current git status if the repo is already under active development

Prefer repo truth over user memory. If the repo already has a partial `ai/` layer, merge carefully instead of overwriting.

## Target layout

Use the default layout in [references/default-layout.md](references/default-layout.md).

If the repo already uses a nearby shape, adapt instead of forcing a rename. The core goal is stable entry points, not cosmetic uniformity.

## File creation rules

Create only what the repo needs. Default set:

- `ai/prd.md`
- `ai/global-rules.md`
- `ai/reference/git-workflow.md`
- `ai/reference/project-map.md`
- `ai/reference/qa-checklist.md`
- `ai/archive/latest.md`
- `ai/commands/prime.md`

Optional, when clearly useful:

- `ai/reference/style-guide.md`
- `ai/reference/component-guide.md`
- `ai/reference/api-conventions.md`
- `ai/reference/piv-roadmap.md`
- `ai/reference/handoff-workflow.md`
- `ai/reference/handoff-template.md`
- `ai/commands/plan-feature.md`
- `ai/commands/commit.md`

See [references/file-responsibilities.md](references/file-responsibilities.md) for what belongs in each file.

## Authoring rules

- Keep each file short and executable.
- Prefer “read this, then do this” over essays.
- Put durable rules in `global-rules.md`.
- Put repo facts in `reference/project-map.md`.
- Put volatile per-iteration state in `archive/handoff_*.md`.
- `archive/latest.md` must always point to the newest handoff doc.
- If handoff names are dynamic, never hardcode a specific handoff file in startup docs; point to `archive/latest.md`.

## Safety rules

- Never overwrite existing substantive docs blindly.
- If a target file already exists, preserve user-authored content and patch it toward the standard shape.
- If the repo has dirty unrelated changes, avoid touching unrelated files while bootstrapping docs.

## Deliverable

When done, report:

- Which prelude files were created or updated
- Which existing docs were treated as sources of truth
- Which startup file should be read first in the next window
