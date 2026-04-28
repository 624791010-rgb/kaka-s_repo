# Default Layout

Recommended baseline:

```text
project-root/
  ai/
    prd.md
    global-rules.md
    reference/
      git-workflow.md
      project-map.md
      qa-checklist.md
      style-guide.md
      component-guide.md
      api-conventions.md
      piv-roadmap.md
      handoff-workflow.md
      handoff-template.md
    commands/
      prime.md
      plan-feature.md
      commit.md
    archive/
      latest.md
      handoff_0.md
```

## Adaptation rules

- If the repo already has `ai/prime.md` at root, keep it unless the user wants commands centralized.
- If the repo already has `doc/` or `docs/`, do not copy large product docs into `ai/`; use `ai/prd.md` as an index.
- `archive/latest.md` is mandatory once handoff docs exist.
- `commands/` is for repeatable startup and workflow commands, not for long narrative docs.
