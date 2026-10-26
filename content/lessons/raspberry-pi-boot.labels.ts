// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-13/prose.md.
export const PI_BOOT_LABELS = {
  title: "Boot and test your Pi",
  objectives: [
    "build an assembly-only image with matching load and link addresses;",
    "boot from a spare card and capture the actual serial report;",
    "test a broken calculation and distinguish observed results from unverified stages.",
  ],
  buildDiagram: {
    kind: "boot",
    title: "Source files to card image",
    note: "The file transformations run by the supplied Makefile. This schematic does not execute the build.",
    nodes: [
      {
        id: "source",
        title: "boot.s + trip_distance.s",
        detail: "Board startup and unchanged arithmetic",
      },
      {
        id: "objects",
        title: "boot.o + trip_distance.o",
        detail: "Separate assembled object files",
      },
      { id: "elf", title: "boot.elf", detail: "Linked using boot.ld at 0x200000" },
      { id: "raw", title: "assembly-lab-pi5.img", detail: "Raw instruction and data bytes" },
      {
        id: "card",
        title: "Card root",
        detail: "config.txt selects the image and the same load address",
      },
    ],
    links: [
      { from: "source", to: "objects", label: "GNU assembler" },
      { from: "objects", to: "elf", label: "GNU linker + boot.ld" },
      { from: "elf", to: "raw", label: "objcopy -O binary" },
      { from: "raw", to: "card", label: "Copy image + config.txt" },
    ],
    footnote: "Keep the raw-image load address in config.txt equal to the link address in boot.ld.",
  },
  titles: {
    question: "From build checks to a hardware test",
    investigation: "Build the Pi 5 image",
    construction: "Prepare the card and capture output",
    failureExperiment: "Break, rebuild and restore",
    explanation: "Find the first missing evidence",
    reflection: "Keep the test record",
  },
} as const;
