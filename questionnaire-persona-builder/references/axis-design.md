# Axis Design

## Defaults

- Default to `2-4` axes.
- Use `5` axes only when explicitly requested.
- For `6+` axes, warn that binary personas become `64+` profiles and recommend reducing axes.

## Independence Criteria

Axes are acceptable when each axis measures a different decision dimension. Avoid axes that are only rewordings of each other.

Good axis contrast examples:

- motivation vs boundary;
- social energy vs planning style;
- emotional need vs expression style.

Weak axis contrast examples:

- security need vs attachment need when both are measured by the same reassurance questions;
- openness vs expressiveness when both only mean "talks more";
- long-term planning vs responsibility when every supporting question overlaps.

## Proposal Format

For each axis, output:

```text
Axis name:
Low side / High side:
What it measures:
Supporting questions:
Why it is independent:
Risk or ambiguity:
```

After the proposal, ask the user to confirm axes before scoring.
