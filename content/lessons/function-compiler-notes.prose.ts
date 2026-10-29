// Copyright © 2026 Christopher Snow

// Separate draft from docs/notes/fundamentals/compiler-intro-review.md.
export const FUNCTION_COMPILER_NOTES = [
  {
    summary: "Which compiler made these instructions?",
    body:
      "Compiler Explorer, an online compiler service, ran GCC 16.1.0 for 64-bit Arm Linux to make this listing. The submitted settings were `-g -O1 -fno-verbose-asm`.\n\n" +
      "To try the same settings locally, save the C shown above as `increment_int.c`. You need GCC 16.1.0 for 64-bit Arm Linux installed as `aarch64-linux-gnu-gcc`. Run:\n\n" +
      "```sh\naarch64-linux-gnu-gcc -g -O1 -fno-verbose-asm -S -o increment_int.s increment_int.c\n```\n\n" +
      "`-O1` selects the optimisation setting described above. `-g` includes C line references for debugging tools. `-fno-verbose-asm` suppresses extra assembly comments. `-S` produces assembly text, and `-o increment_int.s` names the output file.\n\n" +
      "The assembly file also contains compiler and debugging information that this page filters out.",
  },
  {
    summary: "How are C statements matched to instructions?",
    body:
      "The course pairs instructions with the C operations they perform. Here, `add w0, w0, 1` calculates `n + 1` on displayed C line 3. The `ret` instruction returns from the function, as the same line requires. The addition has already left the result in `w0`.\n\n" +
      "GCC’s original line references are kept in the compiler details. GCC 16.1.0 at `-O1` records both instructions against line 4, the closing brace. These references help debugging tools locate C code. They do not always identify the statement an instruction carries out.",
  },
] as const;
