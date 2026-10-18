# Source associations: modules 0–3

Added `sourceLines` to all 27 exported programs with C in the five assigned listing
files. Each entry refers to a displayed C line and corresponds to one instruction,
excluding labels. These are teaching associations, separate from recorded GCC
source tags. The C and assembly strings are unchanged.

## Multiline and composite source

- `TRIP_DISTANCE`: the additions serve lines 3 and 4; subtraction serves line 5;
  `ret` serves the explicit return on line 6. The subtraction and `ret` retain
  GCC's original C7 tags. Returning control does not move the result again.
- `TRIP_DISTANCE_AND_FUEL_USED`: the first four associations are the same;
  `fuel_used` subtracts and returns on displayed line 11. Both instructions retain
  GCC's original C12 tags.
- `KM_TO_SERVICE`: the first three subtractions serve lines 3, 4 and 5. The final
  subtraction by 50 and `ret` both serve line 6, the return expression.
- `SERVICE_AND_ODOMETER`: `service_interval`'s move and return serve line 1;
  `odometer_limit`'s move, halfword insertion and return serve line 2.
- `PICK_INSTRUCTION`: each shift and return pair serves its corresponding C line
  in the four-function source, lines 1 through 4. Its pre-existing raw listing
  concatenates the separate functions' C1 tags; those records remain untouched.

## One-line source

The following exports have a single C line; each instruction serves that line:

- `SERVICE_INTERVAL`, `FUEL_USED_WRONG`, `FUEL_USED_WRONG_U`.
- `ADD_OVERFLOWS`, `ELAPSED`, `SUB_OVERFLOWS`, `NEGATE`.
- `WARN_FUEL`, `CLEAR_DOOR`, `SERVICE_DUE`, `GEAR_OF`, `SET_GEAR`,
  `TOGGLE_LIGHTS`, `HALVE_GRADIENT`, `HALVE_COUNT`, `DIV2`, `TIMES8`.
- `SHR3_INT`, `SHR3_UNSIGNED`, `SHL3_INT`, `SHL3_UNSIGNED`.

The module 3 `recorded` helper generates one `[1]` association per supplied
instruction. This includes the correction before signed division by two in
`DIV2`: both arithmetic instructions implement the single return expression.
The `RECORDED_FUNCTIONS` and `RECORDED_SHIFTS` collections reference these same
programs.

`FUEL_USED_WRONG_PLUS_12` is deliberately different: its subtraction and return
serve line 1, but the inserted addition has `[]`. That addition has no operation
in the displayed C and must not highlight it as if the C requested the change.

## Verification

A source-level comparison against HEAD confirmed that all 27 C programs retain
identical C and listing strings, each map has one entry per instruction, and every
mapped line lies within its displayed source. All 11 assembly-only program
exports in these files remain without mappings. Text-only exercise programs are
unchanged.

The five existing listing/facts test files passed: 166 tests. No instructions or
model behaviour changed. This is an implementation record; independent technical
and browser review is still required before the overall change is complete.
