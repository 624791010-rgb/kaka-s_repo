---
name: questionnaire-persona-builder
description: Build reusable persona systems from questionnaires. Use when the user wants to turn any questionnaire, survey, quiz, or answer set into 2-5 independent axes, option scoring rules, 2^n persona profiles, optional image prompts/assets, or a standalone static HTML demo. Also use when validating or recalculating questionnaire-to-persona configurations.
---

# Questionnaire Persona Builder

Use this skill to convert a questionnaire into a product-style persona engine: axes, scoring, persona copy, optional images, and a static demo.

## Required Workflow

1. Parse the questionnaire into structured questions and options.
2. Propose `2-4` independent axes by default.
3. Support `5` axes only when the user explicitly asks.
4. Warn that `6+` axes are not recommended because binary personas become `64+`.
5. Ask the user to confirm the axes before generating scoring rules.
6. Generate structured scoring rules and validate them with `scripts/validate_config.js`.
7. Ask the user to confirm copy style before generating persona names and reports.
8. Generate exactly `2^n` personas using axis low/high combinations.
9. If the user asks for images, write consistent image prompts and use the current available image generation capability; do not hardcode a model name.
10. Generate a static HTML demo with `scripts/generate_static_demo.js` when requested.

Do not discuss psychological measurement validity unless the user explicitly asks. Treat the output as product, social, marketing, entertainment, or preference-persona design.

## Load References

- Read `references/workflow.md` before running the end-to-end workflow.
- Read `references/schemas.md` before creating or editing JSON config.
- Read `references/axis-design.md` before proposing axes.
- Read `references/scoring-rules.md` before assigning scores.
- Read `references/persona-writing.md` before writing persona copy.
- Read `references/static-demo.md` before generating a static demo.

## Script Usage

Use JSON config as the source of truth.

```bash
node scripts/validate_config.js config.json
node scripts/calculate_persona.js config.json answers.json
node scripts/generate_static_demo.js config.json output-dir
```

`generate_static_demo.js` refuses to overwrite an existing output directory unless `--force` is passed.

## Decision Gates

Stop and ask for user confirmation at these points:

- after axis proposal, before scoring;
- after copy style proposal, before persona writing;
- after persona draft, before image generation;
- before uploading, sharing, or deploying generated artifacts.

## Output Standards

- Keep axes mutually distinct and easy to explain.
- Keep scoring structured, not prose-only.
- Keep persona keys deterministic: join each axis side code in axis order.
- Keep generated assets and demo files separate from source questionnaire files.
- Prefer transparent PNG or web-safe assets for persona portraits unless the user asks otherwise.
