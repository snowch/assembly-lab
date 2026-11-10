// Copyright © 2026 Christopher Snow

// Drafted separately from the computed figures. Numeric values come from their models.
export const FP_COPY = {
  input: "Enter a decimal value",
  apply: "Apply value",
  width: "Format",
  widthNote:
    "Changing Format converts the current stored value. To encode the decimal in the entry field directly in the selected format, press Apply value again.",
  width32: "binary32 (32 bits)",
  width64: "binary64 (64 bits)",
  reset: "Reset example",
  bits: "Stored bits",
  bitLabel: (n: number, value: number, field: string) => `Bit ${n}, ${field}, value ${value}`,
  fieldNames: { sign: "Sign", exponent: "Exponent", fraction: "Fraction" },
  fieldHelp: {
    sign: "The sign applies to the whole value.",
    exponent: "This field controls the scale for a normal value.",
    fraction:
      "For a normal value, these are the bits after the binary point. A leading 1 is implied.",
  },
  classification: "Kind of value",
  kinds: {
    normal: "Normal",
    subnormal: "Subnormal",
    zero: "Zero",
    infinity: "Infinity",
    nan: "NaN (not a number)",
  },
  explanations: {
    normal:
      "A normal value uses a leading 1 before its fraction bits. Subtract the bias from the stored exponent to get the power of two.",
    subnormal:
      "An all-zero exponent field with a nonzero fraction is subnormal. Its leading digit is 0 rather than 1, and it uses the smallest normal exponent.",
    zero: "All exponent and fraction bits are zero. The sign bit distinguishes positive and negative zero.",
    infinity:
      "All exponent bits are 1 and all fraction bits are 0. The sign bit distinguishes positive and negative infinity.",
    nan: "All exponent bits are 1 and at least one fraction bit is 1. This pattern is NaN, meaning not a number; it is not a finite distance.",
  },
  value: "Short decimal display",
  exact: "Exact stored value",
  hex: "Hexadecimal pattern",
  encodedExponent: "Stored exponent",
  bias: "Bias",
  actualExponent: "Power of two",
  calculation: "How these fields form the value",
  signFactor: "Sign factor",
  significand: "Significand",
  error:
    "Enter a whole or fractional decimal number, with an optional exponent such as 1e3 (1000).",
  changed: "The current bits have been decoded.",
  rounding: {
    unordered: "NaN has no place in numeric order, so it has no next smaller or next larger value.",
    note: "This model rounds to the nearest representable value. At an exact halfway point, it keeps the value whose last retained binary bit is 0.",
    below: "Next smaller value",
    above: "Next larger value",
    noSmaller: "No smaller value in this format",
    noLarger: "No larger value in this format",
    previous: "Step to next smaller value",
    next: "Step to next larger value",
    addOne: "Add 1 to the stored value",
    exactSum: "Exact sum before rounding",
    roundedSum: "Stored sum after rounding",
    operation: "The addition is computed exactly first, then rounded once to this format.",
  },
  native: {
    label: "Recorded GCC and QEMU result",
    choose: "Recorded example",
    scrollHint: "Scroll the paired listing sideways to see the instructions beside the C.",
    inputs: "Starting inputs for this independent call",
    reveal: "Show recorded result",
    reset: "Hide recorded result",
    result: "Recorded return value",
    pattern: "Returned pattern",
    evidence:
      "These are checked recordings, not instructions executed by the browser's integer simulator. GCC 16.1 with -O1, an optimisation setting, compiled the complete C shown here. QEMU ran its instructions with floating-point control register set to 0: nearest-even rounding and subnormal values enabled.",
    examples: {
      "add32-exact": "Add two float distances",
      "add32-rounding": "Add 1 where float spacing is 2",
      "add64-exact": "Add the same values as double",
      "mul32-exact": "Multiply litres by price per litre",
      "int32-to-float": "Convert int to float",
      "float-to-int-positive": "Convert a positive float to int",
      "float-to-int-negative": "Convert a negative float to int",
      "widen-float": "Widen float to double",
      "copy-float-bits": "Copy float bits into unsigned int",
    },
  },
  check: {
    label: "Try a fresh example",
    action: "Check answer",
    unanswered: "Answer the question before checking.",
    correct: "That matches the computed result.",
    retry:
      "Compare your answer with the explanation and computed result below, then revise your answer.",
    convertedPattern: "Integer pattern after numeric conversion",
    copiedPattern: "Original floating-point pattern copied unchanged",
    fieldValuePrompt:
      "A normal binary32 value has sign bit 1, stored exponent 128 and all fraction bits 0. What numeric value do these fields encode?",
    fieldKindPrompt:
      "A binary32 pattern has all exponent bits 0 and at least one fraction bit 1. What kind of value does it encode?",
    conversionCopyPrompt:
      "For the same binary32 input, −6.75, which instruction copies its original 32-bit pattern into w0: fcvtzs or fmov?",
    prompts: {
      fields: "Write the binary value of 5.25. Use a point between whole and fractional bits.",
      rounding: "Round the exact number 16777219 to binary32. Enter its stored decimal value.",
      arithmetic:
        "Two independent calls add 2 to 33554432. Which format can keep the exact sum: float, double, or both?",
      conversion:
        "Convert the finite float value −6.75 to int. What integer does truncation towards zero produce?",
    },
    explanations: {
      fields:
        "Read the whole-number bits with weights 4, 2 and 1. After the point, the first two places have weights 0.5 and 0.25. For the field question, subtract the bias from the stored exponent, use the implied leading 1 and apply the sign to the whole magnitude. The feedback shows the model’s decoded value. An all-zero exponent with a nonzero fraction identifies a subnormal value.",
      rounding:
        "At this scale the binary32 spacing is 2. This input is halfway between its two neighbours. Choose the neighbour whose last retained binary bit is 0.",
      arithmetic:
        "Binary32 has spacing 4 at this input, while binary64 can still distinguish consecutive whole numbers here.",
      conversion:
        "Truncating towards zero removes the fractional part. It does not round a negative value down to the next smaller integer. The model also compares the converted integer with the unchanged pattern copied by fmov.",
    },
    answers: { float: "float", double: "double", both: "both" },
  },
} as const;
