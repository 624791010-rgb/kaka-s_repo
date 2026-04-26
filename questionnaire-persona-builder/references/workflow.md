# Workflow

## 1. Questionnaire Parsing

Extract:

- questionnaire title and intended audience;
- question id, section, title, type, and options;
- special question behavior such as allocation totals;
- repeated concepts that may indicate axes.

Normalize question ids to stable values such as `Q1`, `Q2`, or existing ids from the source. Do not change ids after scoring starts.

## 2. Axis Proposal

Propose `2-4` axes by default. Each axis must include:

- `key`: lowercase snake_case;
- `name`: user-facing axis name;
- `lowCode` and `highCode`: short uppercase codes for persona keys;
- `lowLabel` and `highLabel`: user-facing labels;
- `description`: what the axis measures;
- `supportingQuestionIds`: questions that support this axis;
- `differenceFromOtherAxes`: why it is independent.

Ask the user to confirm or revise axes before scoring.

## 3. Scoring Model

Create one or more scoring rules per question. A question may measure multiple axes only when the relationship is clear.

Each scoring rule maps option keys to 0-100 scores. The high side of the axis is represented by higher scores. Use `threshold: 50` unless the user chooses another threshold.

Validate the config before using it.

## 4. Persona Generation

Generate exactly `2^n` personas by enumerating every low/high combination in axis order. Persona keys are joined codes:

```text
EXP_ATT_OPEN_OUT
```

For each persona include:

- key;
- axis side map;
- name;
- short description;
- full report;
- suitable counterpart or fit guidance;
- optional image prompt;
- optional image source.

Ask the user to confirm persona copy before generating images or static demos.

## 5. Static Demo

Generate static HTML only after config validation succeeds. The demo must:

- render all questions;
- enforce allocation totals;
- calculate persona key locally;
- show persona name, description, report, axis scores, and image if available;
- provide a reset/retest action;
- avoid backend dependencies by default.
