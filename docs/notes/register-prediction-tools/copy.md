# Current optional prediction tools copy

{
  "status": "Current reviewed copy; independent review evidence is in review.md.",
  "scope": "Only the register prediction exercise opts into this copy. Preserve all existing calculator help, result labels, errors and default division behaviour in earlier integrations.",
  "lesson": {
    "predictTask": "Without running the instructions, give `x1` and `w2` after all four. Use decimal numbers or hexadecimal numbers beginning with `0x`.",
    "predictCaption": "Predict the two register values after the listing. Calculator and Working notes are optional."
  },
  "integerHexCalculator": {
    "title": "Calculator",
    "calculation": "Calculation",
    "help": "Type your own calculation. The calculator does arithmetic; it does not run the instructions or limit results to a register's width.",
    "format": "Use decimal whole numbers or hexadecimal numbers beginning with `0x`. You can use `+`, `-`, `*`, `/`, `^` and parentheses. Write powers as `2^8`, with a non-negative whole number after `^`. Commas between groups of three decimal digits are accepted. Division must give a whole number.",
    "calculate": "Calculate",
    "decimalResult": "Result in decimal",
    "hexadecimalResult": "Result in hexadecimal"
  },
  "decimalOrHexAnswerError": {
    "template": "The answer for {field} must be a whole number written in decimal or hexadecimal beginning with 0x.",
    "note": "Use the existing field label in {field}. Keep the existing blank-answer message. No example answer is needed."
  },
  "workingNotes": {
    "summary": "Working notes",
    "label": "Your working notes",
    "help": "Your notes stay in this browser when you return to this exercise. They are not graded.",
    "clear": "Clear notes",
    "storageFailure": "Your notes could not be saved in this browser. Your current text is still here. Copy it before leaving or reloading the page."
  },
  "integrationNotes": [
    "The task keeps the prediction timing and the instruction-running restriction, while removing the decimal-only and by-hand requirements.",
    "Use plain text in the caption; render inline code in the task and calculator format as existing prose does.",
    "The decimal comma sentence reflects the existing calculator parser and applies only to decimal calculation inputs. It does not promise comma support in answer fields or hexadecimal literals.",
    "Division wording assumes exact division for the new mode, as specified by the inspected default. If that mode instead deliberately discards fractions, return this sentence for a matching draft.",
    "Show storageFailure only after an observed read/write failure. Keep the current editable text visible, including after an unsuccessful save or clear.",
    "Normal notes help describes persistence, not successful completion of the latest write. Do not add an unconditional Saved status.",
    "No exercise number, expression or answer appears in the new copy. 2^8 is the already-taught generic power syntax."
  ]
}
