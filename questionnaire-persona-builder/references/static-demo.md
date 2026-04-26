# Static Demo

Generate static HTML from a validated config.

The demo should:

- run without a backend;
- render title, description, sections, questions, and options;
- support `single` and `allocation` question types;
- block result generation until all answers are complete;
- enforce allocation totals exactly;
- calculate axis scores and persona key in the browser;
- show persona name, image, description, report, fit copy, and axis scores;
- include a retest button.

Do not add analytics, login, external scripts, remote fonts, or network calls unless the user explicitly asks.

If persona images exist, keep image paths relative to the generated `index.html` or copy assets into the output folder.
