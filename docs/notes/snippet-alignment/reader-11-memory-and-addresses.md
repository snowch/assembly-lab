<!-- Copyright © 2026 Christopher Snow -->

# Snippet alignment reader: Memory and addresses

Independent one-lesson learner review, 18 October 2026, against the immutable production preview at `http://127.0.0.1:4264/assembly-lab/#/lesson/memory-and-addresses`. Assumed only “Before you start” and lessons 00–10. Read `CLAUDE.md`, `docs/style.md` and this workstream's brief. No code or tests changed.

## Findings

**No new finding in the changed snippet presentation.** No severity or corrective direction is assigned to the observations below because the checked behaviour is coherent.

- The opening listing includes the complete four-line C function, including its signature and braces. Its return statement occupies the same desktop row as both related instructions. On a phone, that source row stays directly above its instructions. The return explanation, **“Returns to the code that called this function.”**, makes the role of `ret` explicit.
- Store examples use the open **“Complete C source”** disclosure above the operation excerpts. Their full signatures and braces remain available. The longer signatures wrap within the phone figure without splitting the operation from its instruction.
- For the void functions, **“No C statement is linked to this instruction.”** appears beside `ret`, followed by **“Returns to the code that called this function.”** This is understandable alongside the lesson's **“`void` means this function returns no value.”** The wording does not imply that the function never returns to its caller.
- **“Compiler's C line references”** is initially closed. Its explanation says **“These are the compiler's original line references. They may point to a brace instead of the C operation an instruction carries out.”** Expanded load records retain line 4 for both instructions, while the visible teaching relation uses line 3. Expanded store records retain lines 3 and 4. These agree with the recorded listings in `memory.listings.ts`.
- After a store, the assignment is highlighted both in the complete source and its excerpt. After the void return, neither copy has a C highlight; only the last instruction is highlighted. For the two loads, line 3 stays highlighted when their return instruction runs. The next-instruction arrow and the text below the controls distinguish what ran from what will run next.
- The assembly-only wide-store example remains assembly-only. It has no invented C text, teaching relation or compiler-line disclosure.

## Prior knowledge and existing findings

No new unexplained assumption was found in the changed presentation. Checked the prerequisites and earlier teaching rather than assuming compiler or assembly experience:

- “Before you start” requires small C functions using `int`, `unsigned` and `return`, but explicitly does not require pointers.
- Lesson 00 defines GCC, instructions and listings. Its compiler note explains `-O1` and the `-g` line references; its matching note distinguishes the teaching association from compiler records and explains return control.
- `one-pattern-three-readings` introduces hexadecimal and bit positions. `constants-and-widths` explains `long`, `w`/`x` register views and upper-half clearing. `branches` defines labels and their colon syntax.
- This lesson locally introduces bytes, addresses, pointer declarations and dereferences, `const`, memory brackets, load/store, little-endian order and `void`. Those features need no prior pointer knowledge.

Compared with [the second clarity review](../clarity-review-2/11-memory-and-addresses.md). Its C11-1 (medium, hints under mismatched headings) is an existing issue and was not re-exercised here. Its C11-2 (low) remains visible in **“C requires a valid object of a suitable type.”** The specialised C meaning of “object” is still not established by the prerequisites or earlier lessons. The existing direction, explaining the storage/type requirement in ordinary language, still applies. Neither item is a new snippet-alignment finding.

## Actual browser coverage

Used installed Playwright with real Chromium at **1280 × 900 and 375 × 900, in light and dark themes**, with fresh browser pages for each combination. Read the rendered lesson and inspected the changed listings and disclosures.

For all four combinations:

- Checked both prediction controls before choosing; commitment was disabled. Selected an option and confirmed the corresponding figures remained locked. Pressed “Check your prediction” to reveal them legitimately. There were seven locked figures initially, three after the first commitment, and none after the second. No progress seed was used.
- Stepped all seven memory figures from their initial state through their memory instruction and return: distance load/store, wide store, byte store, halfword store, and long load/store. Captured source highlights, last-run markings and next-instruction markings at each state.
- Expanded every available compiler-reference disclosure and read its content. In a separate browser pass, clicked the complete-source disclosure closed and open, clicked the void-store compiler disclosure open, and used Back and Reset. Back restored the assignment highlight; Reset cleared it.
- Inspected screenshot evidence of desktop pairing, phone wrapping, light/dark highlights, the void return and the expanded compiler references. Document widths were exactly 1280 and 375 respectively. No listing or source-cell overflow and no browser page errors were recorded.

This focused review did not run a build or test suite, submit challenge solutions, open challenge hints, test every prediction choice, or exercise arbitrary inputs. It is not a fresh review of every challenge state or a technical validation of the simulator.

## Evidence

Temporary evidence is outside the repository:

- Browser scripts: `/tmp/snippet-reader-11.mjs` and `/tmp/snippet-reader-11-details.mjs`.
- Rendered text, gates, state highlights and dimension/error records: `/tmp/snippet-11-{1280,375}-{light,dark}.json`.
- Screenshots for each of the four configurations: `/tmp/snippet-11-{1280,375}-{light,dark}-{listing,save-0,save-1,save-2,long,raw-void}.png`.

Representative inspected captures are `/tmp/snippet-11-1280-light-save-1.png`, `/tmp/snippet-11-1280-dark-save-2.png`, `/tmp/snippet-11-375-light-save-1.png`, `/tmp/snippet-11-375-dark-listing.png`, `/tmp/snippet-11-375-dark-raw-void.png` and `/tmp/snippet-11-1280-light-raw-void.png`.
