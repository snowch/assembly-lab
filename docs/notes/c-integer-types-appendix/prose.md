# C integer types and register widths

Canonical copy, edited from the separate Medium draft. The return links use the actual paced register-width lesson.

## LABELS

```json
{
  "title": "C integer types and register widths",
  "line": "Optional reference: compare the widths and readings in three recorded C return values.",
  "objectives": [
    "Explain why the recorded long example uses x0 while the int and unsigned examples use w0.",
    "Explain how the int and unsigned examples return the same bits with different readings."
  ],
  "titles": {
    "width": "long uses 64 bits on this target",
    "readings": "int and unsigned return the same bits here"
  },
  "captions": {
    "long": "A long return value, with its recorded instructions.",
    "int": "An int return value, with its recorded instructions.",
    "unsigned": "An unsigned return value, with its recorded instructions."
  }
}
```

## PROSE

```json
{
  "setup": "This optional reference follows [Writing w and x registers](#/lesson/register-widths).\n\nThe listings are recorded output from ARM64 GCC 16.1.0 with `-O1`, an optimisation setting.\n\nOn a narrow screen, swipe sideways within each listing to see the C and its assembly instructions.",
  "width": "On the selected target for these GCC listings, C’s `int` is 32 bits and `long` is 64 bits. These sizes are not the same on every C system.\n\nThe function below returns −1 as a `long`.",
  "longAfter": "GCC uses `mov x0, -1` here. The `x` name selects all 64 bits, and the instruction sets them all to 1. The `int` example below uses the `w` name to write 32 bits.",
  "readings": "`unsigned` on its own means `unsigned int`. On this target, `int` and `unsigned int` are both 32 bits. Their signed and unsigned readings differ.\n\nFirst, the function returning −1 as an `int`:",
  "intAfter": "`mov w0, -1` sets all 32 bits of `w0` to 1. Read as signed, those bits mean −1. Writing `w0` also clears the upper 32 bits of `x0`.\n\nThe next function returns `4294967295u`. The `u` suffix marks an unsigned integer constant. For this value on this target, the constant’s type is `unsigned int`.",
  "unsignedAfter": "GCC emits the same `mov w0, -1` and `ret` for both functions. Read as unsigned, the 32 set bits mean 4294967295. The register holds the same bits; the C return type says which reading the program means.",
  "takeaway": "A register stores bits without a C type tag. In these recorded examples, the width distinguishes `long` from `int`; the reading distinguishes `int` from `unsigned`. These instruction choices belong to this compiler and these functions.\n\n[Return to Writing w and x registers](#/lesson/register-widths).\n\n[Revisit signed and unsigned readings](#/lesson/same-bits-two-readings)."
}
```

