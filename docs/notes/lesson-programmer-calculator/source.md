# Programmer calculator numeric source

Copyright © 2026 Christopher Snow

The pure numeric core in `packages/machine/src/programmer-calculator.ts` is adapted from
Christopher Snow's [snowch/programmer-calculator](https://github.com/snowch/programmer-calculator/blob/efa1584bd6deb69b2e287aae579739c4a73bf052/index.html),
commit `efa1584bd6deb69b2e287aae579739c4a73bf052`, `index.html`. The retained source used for
the import is `/workspace/scratch/progressive-calculator/upstream-index.html`, SHA-256
`df1768c9d96e5bf55bbe4d622955284ee6e264200bcd14a6ccb798c7e90ca8bf`.

Upstream lines 526–530 supply `BIG`, `mask`, `signBit`, `clamp` and `toSigned`;
lines 577–599 supply `compute`. The imported mechanisms are BigInt width masks,
normalisation of negative or overflowing results, the signed reading of a pattern, and
addition, subtraction and left shift. Width and reading are explicit typed arguments;
there is no shared mutable calculator state. The public names and string interchange
are course-specific. Parsing, raw input guards, untruncated full-result reporting and
32-bit half editing are new adaptation code. Entry rejects values outside the selected
range; only arithmetic and an explicit call to `calculatorPattern` discard upper bits.
Long significant digit sequences are rejected before conversion to BigInt. All public
string results use exact decimal integers.

For addition and subtraction, `left`, `right` and `full` use the selected numeric reading.
For left shift, `left` is the raw unsigned pattern, `right` is the count and `full` is the
untruncated unsigned product by two to that count. Counts must lie from zero through
width minus one. Pattern interchange and half editing validate unsigned decimal strings
and throw on malformed or out-of-range arguments. Entry parsing instead returns its
documented error union. Hexadecimal entry always denotes raw bits, in either reading.

No DOM, flags, keypad, standalone exercises, Unicode support, service worker or runtime
network dependency is imported. In particular, upstream subtraction's carry/borrow flag
is outside this import. This mathematical tool does not execute an Arm instruction or
implement C integer rules. The existing ISA model remains responsible for instruction
and architectural flag behaviour.

The retained HTML has no copyright or licence notice. The source owner's attribution
and the course copyright are kept in the adapted file; no new upstream licence claim is
made. The course owner explicitly requested this reuse. Updates are deliberate rather
than automatically synchronised with upstream interface changes.
