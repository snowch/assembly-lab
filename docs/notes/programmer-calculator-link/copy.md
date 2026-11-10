Historical external-only aid from PR #121. The local lesson-specific calculator now replaces that aid; see [current integration copy](../lesson-programmer-calculator/copy.md).

# Current programmer-calculator aid copy

{
  "scope": "Replace only the inline calculator in the register-width prediction exercise. Keep Working notes and the task unchanged.",
  "programmerCalculator": {
    "label": "Open programmer calculator",
    "newTab": "Opens in a new tab",
    "help": "Inspect your own values as bits, hexadecimal or decimal. The calculator does not run the instructions.",
    "href": "https://snowch.github.io/programmer-calculator/"
  },
  "lessonLabels": {
    "predictCaption": "Predict the two register values after the listing. Programmer calculator and Working notes are optional."
  },
  "implementationNotes": [
    "Show the new-tab text beside the anchor and include it in the anchor's accessible description or name.",
    "Keep the help visible beside the link. Use a normal anchor with target=_blank and rel=noopener noreferrer.",
    "Do not append exercise data, examples, answers, a query or a fragment to the URL.",
    "No width guidance is needed in this copy. Do not equate the calculator's controls with instruction execution."
  ]
}
