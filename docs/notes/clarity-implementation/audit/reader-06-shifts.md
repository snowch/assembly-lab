# Independent learner review: 06 — Shifts, and the type that picks one

Read-only review, 18 October 2026. No previous review notes consulted. Read CLAUDE.md, docs/style.md, docs/authoring.md, the front-page Before you start panel, and preceding lesson prose in content/lessons/index.ts order (meet-the-machine through masks). Reviewed all shifts prose, labels, options, challenge tasks, five hints each, feedback, notes, recorded program wiring and relevant shared component strings.

Built-browser coverage: http://localhost:4290/assembly-lab/#/lesson/shifts, Chromium through installed Playwright. Fresh contexts at 375×900 and 1280×900, both light and dark. Inspected initial page and expanded disclosures, committed both predictions with a wrong selection, unlocked investigation, selected ASR and LSR and shift distance 2, stepped both div2 calls, Back and Reset, expanded all five hints for each challenge. Did not exhaustively submit challenge inputs; challenge feedback read in source. No horizontal page overflow at the checked phone state. Screenshots /tmp/shifts-{375,1280}-{light,dark}-{initial,expanded,prediction,step}.png. Browser text /tmp/review06-output.txt and /tmp/review06-interact-output.txt. Source untouched.

## 1. Medium — feedback promises a visual comparison the prediction does not show

Exact text: “The figure marks the filled top bit in each case.” Source: content/lessons/shifts.prose.ts:30. State: after checking the first prediction, all four browser configurations.

The prediction contains an entry row and before/after rows for one executed instruction. The two visually outlined bits are changed low bits. The top bit has no filled-bit mark, and there is no separate second-instruction result row. Implementation agrees: packages/views/src/interactives/ProbePrediction.tsx:116 supplies only marks.changed, using differing(before, after). In contrast, the later investigation control can show filled bits, but starts with a left shift and is not the figure containing this sentence.

Learner effect: the explanation directs attention to an absent distinction at exactly the point the learner is trying to distinguish a moved bit from a newly filled bit. The highlighted low bits can be mistaken for the promised marks.

Direction: make the sentence and actual demonstrated figure agree. Either supply the promised comparison with the filled positions explicitly marked, or direct the learner to the investigation and the controls needed to inspect it. Preserve the prediction gate. No claim that the computed arithmetic itself is wrong.

## 2. Medium — phone captions obscure when the displayed register value applies

Exact label: “w0 when the call starts”; later “w0 before” and “w0 after”. Sources: packages/views/src/interactives/ProbePrediction.tsx:78, :107, :113; label layout packages/views/src/bits.tsx:170. State: first prediction before and after commit, phone375 in both themes.

The entry caption occupies a very narrow first column alongside the long hexadecimal/decimal text. Its words break into fragments: “w0 / whe / n / the / cal / l / sta / rts”. The before/after labels also split inside words. The bit row sits well below this tall caption. At desktop the labels are readable and associate with their rows normally. Source confirms the narrow-screen grid gives the value an auto-sized column and the caption minmax(0, 1fr), then permits breaking anywhere: packages/views/src/bits.css:479–489. The desktop media rule allocates a separate 8rem caption column. This is internal caption wrapping, not horizontal page overflow.

Learner effect: the important execution-time distinction exists in the words but becomes difficult to read and connect to the bits on the phone. The extra vertical height makes comparing before and after unnecessarily cumbersome.

Direction: give the moment label a normal readable line on narrow screens and keep it directly attached to its value and bit row. Do not solve this merely by shortening away the execution moment. Screenshots /tmp/shifts-375-light-prediction.png and /tmp/shifts-375-dark-prediction.png.

## 3. Low — optional C note assumes an untaught standards distinction

Exact text: “For a negative `int`, the C standard leaves the result of `>>` to the implementation. GCC defines it as an arithmetic shift. For a signed `int`, C leaves some left shifts undefined, a negative value among them. GCC defines them…” Source: content/lessons/shifts.prose.ts:19. State: expand “What C says” in the opening section, before the investigation defines arithmetic shift.

The prerequisites teach reading small C functions, and previous lessons explain compiler choice/settings and register readings. They do not explain what “the implementation” means here or how an undefined operation differs from a result that the C standard delegates to an implementation. The consecutive “GCC defines” sentences make those two different situations sound interchangeable. “Arithmetic shift” also appears in this optional opening note before its definition below.

Learner effect: the note intended to qualify the main statement requires knowledge the learner has not been given; the learner cannot tell what can safely be assumed across compilers from this wording alone.

Direction: explain the practical distinction in plain language at this first occurrence, identify the compiler as the implementation being discussed, and place or briefly explain the shift mechanism when needed. The concern is explanation, not an independent claim that the GCC extension is inaccurate.

## Assumed knowledge inventory

Unsupported: the C standard / implementation / undefined-result distinctions above; arithmetic shift first named inside that note before its explanation. No additional unsupported prerequisite found in the core path: bit patterns and signed readings are taught in one-pattern-three-readings; register halves and movk/lsl syntax in constants-and-widths; carry/flags/QEMU in adding-and-the-flags; words, numbered bits, fields and ordinary LSL in masks; operands and GCC -O1 in Module0. This lesson itself introduces >> and <<, logical versus arithmetic shifts, and C integer division rounding before the corresponding challenge.

## Additional cross-cutting observation for coordinator deduplication

The built page still labels both probe predictions and both answer-only challenges “STEPPED” (content/lessons/shifts.ts:76, :117, :131 and the pick-instruction interactive). The actual manually stepped div2 figure has that label too. This may belong with the shared badge/guidance review; it is not a separate ranked finding here. The opening and failure questions otherwise specify the operation sufficiently: the latter explicitly asks about the first instruction, with the shifted operand explained immediately above. The div2 stepper shows useful before/operand/after values after running its first instruction and resets when a different call is selected.
