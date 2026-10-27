// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-13/prose.md.
export const PI_PREP_LABELS = {
  title: "From QEMU to Raspberry Pi 5",
  objectives: [
    "identify the unchanged function and the board-specific startup and output;",
    "connect the Debug Probe to the Pi 5's dedicated UART;",
    "trace the selected boot path from firmware to our assembly program.",
  ],
  titles: {
    question: "The same function on a physical board",
    motivation: "What you need",
    investigation: "Connect the serial cable",
    explanation: "From power-on to our program",
    reflection: "What carries across",
  },
  captions: {
    serial: "The serial report travels from the Pi, through the probe, to your terminal.",
    boot: "The selected normal microSD boot path, from board startup to the trip report.",
  },
  serialDiagram: {
    kind: "serial",
    title: "Pi 5 serial connection",
    note: "Connection schematic. Identify the marked sockets on the actual devices before connecting the supplied cable.",
    nodes: [
      { id: "pi", title: "Raspberry Pi 5", detail: "Dedicated three-pin connector labelled UART" },
      { id: "probe", title: "Debug Probe", detail: "Socket labelled U; powered by USB" },
      { id: "computer", title: "Your computer", detail: "Terminal receiving the serial report" },
    ],
    links: [
      { from: "pi", to: "probe", label: "Serial output · supplied three-pin cable" },
      { from: "probe", to: "computer", label: "USB serial data" },
    ],
    footnote:
      "Connect with power off. Use the dedicated UART connector, not the GPIO header or the probe's D socket. [Official connector and cable pictures](https://www.raspberrypi.com/documentation/microcontrollers/debug-probe.html#about-the-debug-probe).",
  },
  bootDiagram: {
    kind: "boot",
    title: "The Pi 5 boot path used here",
    note: "A source-checked schematic of the selected microSD path, not a recording of the board.",
    nodes: [
      { id: "rom", title: "Boot ROM", detail: "Begins the board's boot process" },
      {
        id: "eeprom",
        title: "EEPROM bootloader",
        detail: "Includes Pi 5 firmware; reads the selected microSD image",
      },
      { id: "stub", title: "Firmware's Arm stub", detail: "Prepares the handoff to the image" },
      { id: "startup", title: "Our _start", detail: "Prepares the stack and clears .bss" },
      { id: "trip", title: "trip_distance", detail: "Runs the unchanged assembly calculation" },
      {
        id: "uart",
        title: "Serial report",
        detail: "Our caller checks the returned result and sends a message",
      },
    ],
    links: [
      { from: "rom", to: "eeprom", label: "Board boot" },
      { from: "eeprom", to: "stub", label: "Firmware startup" },
      { from: "stub", to: "startup", label: "Image handoff" },
      { from: "startup", to: "trip", label: "Function call" },
      { from: "trip", to: "uart", label: "Return, check and send" },
    ],
    footnote:
      "Other boot media, recovery and secure-boot paths are outside this exercise. [Raspberry Pi boot documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#boot-sequence).",
  },
} as const;
