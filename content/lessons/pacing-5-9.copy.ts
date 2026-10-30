// Copyright © 2026 Christopher Snow

// New pacing copy; exact strings recorded in docs/notes/course-pacing-implementation/copy.md.
export const pacing5To9 = {
  "counting-up": {
    title: "Following a loop",
    objectives: [
      "follow repeated passes through a loop and distinguish an iteration from an instruction.",
    ],
  },
  "writing-an-upward-loop": {
    title: "Writing an upward loop",
    objectives: ["write a loop that repeats until its counter reaches the limit."],
    intro:
      "Use the `dim_up` calculation you have just traced. Write its loop, then check how the backward branch decides whether to repeat.",
  },
  "counting-down": {
    title: "Counting down with flags",
    objectives: ["use subtraction flags to repeat a countdown loop."],
  },
  "testing-before-and-after": {
    title: "Testing before or after the body",
    objectives: ["choose whether a loop must test before its first pass."],
    intro:
      "A test after the body runs that body before deciding whether to repeat. Follow the zero-count run to see why the first test matters. Then inspect whether the unsigned stopping condition can ever become false.",
  },
  "stopping-when-work-ends": {
    title: "Stopping when useful work ends",
    objectives: ["stop a countdown loop when either the count or the remaining work reaches zero."],
    intro:
      "The `dim_down` loop has no useful shifting left once brightness reaches zero. Write a version that stops when either the ticks or the brightness run out. Follow the exercise’s input and return contract.",
  },
  "loading-widths": {
    title: "Loading stored values",
    objectives: ["choose a load that preserves the intended signed or unsigned value."],
  },
  "extending-register-values": {
    title: "Extending values in registers",
    objectives: ["extend a value already held in a register before using it at a wider width."],
    intro:
      "A wider calculation may need a value extended without reading memory again. Compare the register-only extensions with the casts that request them.",
    activity:
      "Compare the input bits with each extended result. Identify whether the added bits are zeros or copies of the original top bit. Then follow the wider calculation that uses the value.",
  },
  "array-addresses": {
    title: "Selecting an array element",
    objectives: ["scale an index to select the intended array element."],
  },
  "traversing-arrays": {
    title: "Walking an array",
    objectives: ["follow and write an array traversal with a moving pointer."],
    intro:
      "Use the same array as before, with its starting address in `x0`. Compare the three addressing forms, then follow how the pointer moves while the loop sums the elements.",
  },
  "products-and-widths": {
    title: "Multiplication and addition",
    objectives: ["use a low-width product and combine multiplication with addition."],
  },
  "reading-product-halves": {
    title: "Reading both halves of a product",
    objectives: ["compare the low and high halves of signed and unsigned products."],
    intro:
      "The same register bits can produce different high halves under signed and unsigned multiplication. The low half alone does not show that difference.",
    activity:
      "Run the two multiplications with the same inputs. Compare their low halves, then their high halves. Use each input’s signed or unsigned reading to explain the difference.",
  },
  "division-and-remainders": {
    title: "Division and remainders",
    objectives: ["use a quotient and remainder while preserving the required input values."],
  },
  "dividing-by-a-constant": {
    title: "How GCC divides by a constant",
    objectives: ["follow a recorded multiplication-and-shift implementation of unsigned division."],
    intro:
      "A constant divisor can let a compiler choose a different instruction sequence. This record shows GCC’s choice for `groups_of_ten`.",
    activity:
      "Step through the multiply and shift. Compare the returned value with unsigned division of the same input by ten. Identify which instructions produce the quotient; keep this compiler choice separate from the rule for division.",
  },
  "calls-and-returns": {
    title: "Saving a return address",
    objectives: ["save and restore the return address when one function calls another."],
    question:
      "A helper call writes a new return address. How can the calling function keep the address it needs to return to its own caller?\n\nThe function making a call is the **caller**; the function receiving it is the **callee**. Follow `relay_distance`, then build the call and return sequence.",
  },
  "preserving-values-across-calls": {
    title: "Preserving values across a call",
    objectives: ["preserve a value that a caller still needs after a helper returns."],
    intro:
      "Saving the return address lets a function return. It may also need to keep data across the call. Follow `trip_report` to identify what must survive, then preserve those values in your own function.",
  },
  "widening-products": {
    title: "Widening before multiplication",
    objectives: ["preserve a full product by widening the operands before multiplication."],
    intro:
      "A wider destination cannot recover product bits already discarded. Compare the two recorded calculations to find where the widening must happen.",
  },
  "consumption-calculation": {
    title: "Calculating fuel consumption",
    objectives: [
      "combine multiplication and division while preserving the required intermediate values.",
    ],
  },
  "transfer-widths": {
    title: "Choosing a transfer width",
    objectives: ["choose a memory-transfer width that preserves neighbouring stored values."],
    intro:
      "An address identifies where a transfer starts; its width determines how many bytes it touches. Compare the stores, then copy the required value without overwriting its neighbour.",
  },
  "recursive-calls": {
    title: "Following recursive calls",
    objectives: [
      "follow how recursive calls save their values and resume after the base case returns.",
    ],
  },
  "making-recursive-progress": {
    title: "Making recursive progress",
    objectives: ["make each recursive call approach the base case and use the returned result."],
    intro:
      "A base case cannot finish a calculation that never reaches it. Test the unchanged-argument version of `fade_sum`, then complete `lit_count` so each call advances towards zero and counts its own level.",
  },
  "memory-and-addresses": {
    title: "Memory and addresses",
    objectives: ["use an address to load and store a value in memory."],
  },
} as const;
