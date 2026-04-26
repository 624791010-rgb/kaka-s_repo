# Schemas

Use one JSON config file as the source of truth.

## Config Shape

```json
{
  "meta": {
    "title": "Relationship Preference Test",
    "description": "Optional intro copy"
  },
  "axes": [
    {
      "key": "relationship_goal",
      "name": "Relationship Goal",
      "lowCode": "EXP",
      "highCode": "LONG",
      "lowLabel": "Experience",
      "highLabel": "Long-term",
      "threshold": 50,
      "description": "What this axis measures"
    }
  ],
  "questions": [
    {
      "id": "Q1",
      "section": "Section title",
      "title": "Question title",
      "type": "single",
      "options": [
        { "key": "A", "label": "Option A" },
        { "key": "B", "label": "Option B" }
      ]
    },
    {
      "id": "Q2",
      "section": "Section title",
      "title": "Allocation question",
      "type": "allocation",
      "total": 20,
      "options": [
        { "key": "A", "label": "Trait A" },
        { "key": "B", "label": "Trait B" }
      ]
    }
  ],
  "scoring": [
    {
      "questionId": "Q1",
      "axisKey": "relationship_goal",
      "weight": 1,
      "optionScores": {
        "A": 20,
        "B": 80
      }
    }
  ],
  "personas": [
    {
      "key": "EXP",
      "axisSides": {
        "relationship_goal": "low"
      },
      "name": "Persona Name",
      "description": "Short user-facing copy",
      "report": "Long report copy",
      "fit": "Suitable counterpart guidance",
      "imagePrompt": "Optional image prompt",
      "imageSrc": "Optional relative image path"
    }
  ]
}
```

## Answers Shape

Single-choice answers:

```json
{
  "Q1": "A"
}
```

Allocation answers:

```json
{
  "Q2": {
    "A": 5,
    "B": 15
  }
}
```

Allocation values must sum to the question `total`.

## Persona Key Rule

Axis order is the order in `axes`. For each axis:

- score `< threshold` uses `lowCode`;
- score `>= threshold` uses `highCode`.

Persona key is the joined side codes in axis order.
