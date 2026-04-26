# Questionnaire Persona Builder

Turn a questionnaire into a reusable persona system for Codex:

- propose `2-4` independent axes by default;
- support `5` axes if the user explicitly asks;
- warn against `6+` axes because binary personas become `64+`;
- generate structured scoring rules;
- generate `2^n` persona profiles;
- optionally generate image prompts and persona images;
- generate a standalone static HTML demo.

This skill is designed for productized questionnaire workflows such as social tests, interest/personality quizzes, marketing segmentation, and relationship-style portraits. It does **not** claim psychological measurement validity.

## What This Skill Includes

- `SKILL.md`
  Core trigger description and workflow instructions for Codex.
- `references/`
  Rules for axis design, scoring, persona writing, schemas, and static demo generation.
- `scripts/validate_config.js`
  Validate questionnaire-to-persona config integrity.
- `scripts/calculate_persona.js`
  Calculate persona results from a config and an answers file.
- `scripts/generate_static_demo.js`
  Generate a standalone static HTML demo from a validated config.
- `assets/static-demo-template/`
  HTML template used by the static demo generator.

## Install

Place the whole folder in the target machine's Codex skill directory:

```text
~/.codex/skills/questionnaire-persona-builder/
```

On Windows this is typically:

```text
C:\Users\<your-user>\.codex\skills\questionnaire-persona-builder\
```

If `CODEX_HOME` is set, use:

```text
$CODEX_HOME/skills/questionnaire-persona-builder/
```

Codex discovers the skill from `SKILL.md`. There is no separate installer.

## Requirements

- Node.js
- A Codex environment that supports local skills

The scripts are plain Node scripts and do not require npm install.

## Typical Usage

Ask Codex to use the skill for tasks like:

- "Turn this questionnaire into a 4-axis persona system."
- "Use questionnaire-persona-builder to design axes and scoring for this survey."
- "Generate 16 personas from this questionnaire and write warm, emotional copy."
- "Create a static HTML demo from this persona config."
- "Validate this questionnaire persona config and calculate the result for these answers."

## Workflow

1. Parse the questionnaire into structured questions and options.
2. Propose `2-4` candidate axes.
3. Ask the user to confirm axis design.
4. Generate scoring rules and weights.
5. Validate the config.
6. Generate `2^n` personas from binary axis combinations.
7. Ask the user to confirm copy style and persona text.
8. If requested, generate image prompts and persona art with the current available image capability.
9. Generate a static HTML demo if requested.

## Config Shape

The source of truth is one JSON config file with these top-level fields:

```json
{
  "meta": {},
  "axes": [],
  "questions": [],
  "scoring": [],
  "personas": []
}
```

Detailed schema rules are documented in:

- `references/schemas.md`
- `references/scoring-rules.md`

## Script Commands

Validate a config:

```bash
node scripts/validate_config.js config.json
```

Calculate a persona result:

```bash
node scripts/calculate_persona.js config.json answers.json
```

Generate a static demo:

```bash
node scripts/generate_static_demo.js config.json output-dir
```

Force overwrite an existing output directory:

```bash
node scripts/generate_static_demo.js config.json output-dir --force
```

## Notes

- Persona count is always `2^n`.
- This skill assumes binary low/high sides per axis.
- If you need non-binary clustering or a non-`2^n` persona count, use a different modeling approach.
- The skill intentionally separates natural-language guidance from deterministic scripts.

## Repository Tips

If you publish this skill to GitHub, keep the repository root as:

```text
questionnaire-persona-builder/
├── SKILL.md
├── README.md
├── references/
├── scripts/
├── assets/
└── agents/
```

That makes it easy for other users to clone or copy the folder directly into their Codex skill directory.
