# Module 0 compiler command record

Recorded repeat compilation on 18 October 2026 through Compiler Explorer's
`carm64g1610` (ARM64 GCC 16.1.0). The original 16 October listing remains in
`../listings.md`; this new record retains the complete option list needed for the
expanded compiler note.

- `trip.c` is the displayed `trip_distance` function with the repository's copyright
  comment added above it.
- `trip.request.json` retains the exact submitted source, `-O1` user argument and
  display filters.
- `trip.response.json` retains the complete response, including `compilationOptions`
  and the instructions' C-line associations.

The service's option list is:

```
-g -o /app/output.s -fno-verbose-asm -S -fdiagnostics-color=always -O1 /app/example.c
```

The learner-facing command names a GCC 16.1.0 compiler for AArch64 Linux and replaces
only the service input/output paths with local filenames `trip.c` and `trip.s`.
Its line breaks are shell continuations. It is an equivalent local invocation,
not a claim that Compiler Explorer used that local executable name.

The response contains the same four instructions as the lesson. Its C-line
associations are 4, 5, 8 and 8 because the retained C file includes the copyright
line. Removing that line, as the figure does, gives the displayed associations
3, 4, 7 and 7. This matches the existing Module 0 source-line convention.

Compiler Explorer's filters hide directives, unused labels and comment-only lines;
the `.s` file generated locally includes compiler/debugging information around the
function instructions. The flags and the display filters are separate settings.
