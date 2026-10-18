# C and instruction alignment

The user asks to fix all code snippets after identifying that the introductory
C and assembly columns neither align visually nor show the semantic operation
reliably. GCC's source references can point to a closing brace. Preserve recorded
compiler output and instruction order; add a separate, checked teaching relation.

## Facts and design constraints

- The initial trip listing performs the additions on displayed C lines 3 and 4,
  the subtraction on line 5, and returns control with the result already in w0.
  Its recorded GCC tags are 3, 4, 7, 7. Those recorded tags must remain unchanged.
- The parsed lessons contain 104 distinct recorded {c,listing} pairs: 74 with C,
  30 assembly-only. The source inventory is /tmp/snippet-inventory.json.
- Optimisation can combine operations, introduce support instructions, or order
  instructions differently from C statements. Several instructions can serve one
  C operation; one instruction can serve several source operations.
- Add sourceLines metadata: one array of displayed C line numbers per assembly
  instruction, excluding labels. These are reviewed teaching associations, not
  replacement GCC debug records. Empty arrays identify instructions with no direct
  C operation. Do not guess associations from the nearest brace at runtime.
- Preserve full C source, labels, instruction order, branch structure, prediction
  gates and comparison markings. Deleting an instruction must retain its neighbours'
  associations. Dynamic local compiler output uses its actual emitted source map.
- C/assembly figures need paired rows that stay aligned when text wraps; phone
  rows keep each source/instruction pair together. Reordered source references
  may need repeated excerpts, clearly distinguished from the complete C source.
- Expose GCC's original source references in optional compiler detail, labelled as
  compiler records. Use checked teaching associations for normal source highlights.
- Existing assembly-only figures, editable code, and raw online compiler output
  must not acquire invented C mappings.

Separate drafting supplies all new learner prose and revisions to misleading
captions. Follow docs/style.md. Technical reviewers check mappings against C,
assembly and model behaviour. Independent readers inspect each affected lesson
in a production browser at desktop/phone widths and both themes. Sceptics settle
findings; checkers verify fixes. Preserve the platform copy and the separately
completed offline-clarity changes already in the working tree.
