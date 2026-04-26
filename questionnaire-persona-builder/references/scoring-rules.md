# Scoring Rules

Use scores from `0` to `100`.

- Lower scores represent the axis low side.
- Higher scores represent the axis high side.
- Use `threshold: 50` unless the user chooses otherwise.
- Use `weight: 1` by default.
- Increase weight only for questions that directly ask the core axis tradeoff.
- Do not assign scores to an axis if the question does not meaningfully measure it.

## Single Choice

Each option gets one score per measured axis.

```json
{
  "questionId": "Q1",
  "axisKey": "planning_style",
  "weight": 1,
  "optionScores": {
    "A": 90,
    "B": 65,
    "C": 25,
    "D": 45
  }
}
```

## Allocation

Allocation question scoring is the weighted average of allocated points and option scores.

```text
axisScore = sum(answer[option] * optionScore[option]) / sum(answer[option])
```

The answer total must equal the question total.

## Validation Expectations

Before calculation:

- every question must have at least one scoring rule;
- every scoring rule must reference an existing question and axis;
- every option in a scored question must have a numeric score;
- every axis must have at least one supporting scoring rule;
- persona count must equal `2^axisCount`.
