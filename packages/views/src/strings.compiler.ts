// Copyright © 2026 Christopher Snow

// Separately drafted copy for the course compiler and its editors.
export const COMPILER_STRINGS = {
  editor: {
    text: "Edit C text",
    templates: "Build C from statements",
    source: "C source",
    lines: "Source lines",
    line: (n: number, text: string) => `Line ${n}: ${text}`,
    empty: "No source lines yet. Add a function and its statements.",
    addLine: "Add line",
    removeLine: "Remove line",
    up: "Move line up",
    down: "Move line down",
    statement: "Replacement statement",
    statementHelp:
      "Selecting a line loads it into these controls when they can represent it. Check the replacement preview before replacing the line.",
    preview: "Replacement preview",
    unsupportedLine:
      "This line cannot be loaded into the statement controls. Use Edit C text, or choose a statement type to build a replacement.",
    target: "Variable to assign",
    left: "Left value",
    right: "Right value",
    operator: "Operation",
    number: "Number",
    clearNumber: "Clear number",
    apply: "Replace selected line",
    applyEmpty: "Add statement",
    useNumber: "Use the entered number",
    noOperator: "Use one value",
    kinds: {
      function: "Start a function",
      declaration: "Declare and initialise a variable",
      assignment: "Assign a value",
      return: "Return a value",
      if: "Start an if statement",
      else: "Start the else branch",
      while: "Start a while loop",
      for: "Start a for loop",
      end: "Close a block",
    },
  },
  playground: {
    compile: "Compile C",
    run: "Run with these inputs",
    inputs: "Function inputs",
    input: (name: string) => `Input ${name}`,
    compiled: (n: number) => `Compiled to ${n} ${n === 1 ? "assembly line" : "assembly lines"}.`,
    notRun: "Choose inputs and run the compiled function.",
    checked: (value: string | number) => `The C evaluator and A64 simulator both return ${value}.`,
    undefined: "The C evaluator stopped before running the assembly. Read the diagnostic below.",
    diagnostics: "Compiler and evaluator diagnostics",
    diagnostic: (line: number, column: number, message: string) =>
      `Line ${line}, column ${column}: ${message}`,
    subsetSummary: "The C this compiler accepts",
    subset:
      "Write one function returning unsigned, with unsigned parameters and initialised unsigned local variables. You can use arithmetic, bitwise operations, comparisons, shifts, assignments, if/else, while and for. Calls, pointers, arrays and signed declarations are outside this subset. The compiler also limits source size and nesting. A successful compilation does not prove every input safe; each run checks its C operations before the assembly executes.",
    reset: "Restore the original C",
    compare: "Compare with GCC",
    privacy:
      "Pressing Compare with GCC sends this C source to Compiler Explorer’s public service. The lesson works without sending it.",
    privacyLink: "Compiler Explorer privacy policy",
    attribution: "Compiler output provided by Compiler Explorer.",
    openGcc: "Open this C in Compiler Explorer",
    loading: "Waiting for Compiler Explorer…",
    failed:
      "Compiler Explorer could not return a listing. Your local compiler and exercises are still available.",
    offline:
      "GCC comparison needs a network connection. The local compiler and exercises work offline.",
    cached: "Showing the saved compiler response for this source and these settings.",
    gccTitle: "Recorded GCC response",
    courseTitle: "Course compiler assembly",
    loopPhase: {
      initialisation: "Loop: set the starting value",
      condition: "Loop: test whether to run the body",
      body: "Loop: execute the body",
      update: "Loop: run the update",
      repeat: "Loop: return to the condition",
    },
    argumentsInvalid: "Enter one whole unsigned 32-bit value for each parameter.",
    machineFailed:
      "The assembly did not complete with the result calculated by the C evaluator. Check the reported run before using its result.",
  },
  grader: {
    empty: "Write a C function before running the tests.",
    compileFailed: "The C did not compile. Read the diagnostic and check the supported syntax.",
    undefinedRun:
      "The C evaluator could not complete this test safely. Read its diagnostic before changing the code.",
    mismatch: "The function returned a different value from the one required by this test.",
    actual: "Returned value",
    expected: "Required value",
  },
} as const;
