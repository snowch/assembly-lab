// Copyright © 2026 Christopher Snow

// ARM64 GCC 16.1.0, -g -O1 -fno-verbose-asm. Actual request, response and compiler
// metadata: docs/notes/module-0/two-arguments/. Displayed C omits the copyright
// comment. Original GCC references consequently move from line 5 to displayed C4;
// checked teaching associations name the return expression at displayed C3.
export const ADD_INTS = {
  c: ["int add_ints(int a, int b)", "{", "    return a + b;", "}"].join("\n"),
  listing: ["add_ints:", "  add w0, w0, w1 C4", "  ret C4"].join("\n"),
  sourceLines: [[3], [3]],
} as const;
