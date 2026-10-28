// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-13/prose.md.
export const PI_PREP_PROSE = {
  question:
    "The trip calculation already runs on QEMU. Move that same assembly function onto a Raspberry Pi 5. The work changes around it: firmware loads the image, startup prepares the processor, and a physical serial connection carries the report.\n\n**Hardware verification is pending.** The build checks inspect the image's files and layout. They do not establish that the Pi boots it or sends readable serial output. The next lesson gives you that physical test.",
  motivation:
    "Complete Module 12 first. Use these parts:\n\n- A Raspberry Pi 5 and its suitable power supply.\n- An [official Raspberry Pi Debug Probe](https://www.raspberrypi.com/products/debug-probe/), including its USB cable and three-pin-to-three-pin serial cable.\n- A spare microSD card and a card reader. Keep your usual Raspberry Pi OS card separate.\n- A Linux computer with the GNU tools from Module 12 and a USB port for the probe. The commands use an Ubuntu terminal. Downloading the bundle and installing tools needs an internet connection.\n\nThe Debug Probe carries serial bytes between the Pi and your computer. We use that connection to read output, not to step the processor. The probe receives power over USB; power the Pi through its normal power supply.\n\nIf you have a normal Raspberry Pi OS card, record the board and bootloader before swapping it out:\n\n```sh\ncat /sys/firmware/devicetree/base/model\nsudo rpi-eeprom-update\nrpi-eeprom-config\n```\n\nThese commands read identification and settings; do not add update or edit flags. Keep the output with your test record. If that information is unavailable, record it as unknown.",
  investigation:
    "With the Pi and probe disconnected from power, connect the supplied three-pin cable between the probe's **U** socket and the Pi 5 connector labelled **UART**. This dedicated connector is separate from the large GPIO header. The probe's **D** socket is for a different debugging connection.\n\nMatch the keyed plugs to their sockets and do not force them. Use the [official probe picture and cable guide](https://www.raspberrypi.com/documentation/microcontrollers/debug-probe.html#about-the-debug-probe) to identify them. The schematic shows the connection and output direction; it is not a pin-orientation drawing or a recording of a Pi run. Leave the Pi powered off until the next lesson's terminal is ready.",
  explanation:
    "The diagram follows this example's normal microSD boot path. The Pi stores its bootloader in **EEPROM**, rewritable storage that keeps its contents without power. Pi 5's bootloader includes firmware work that older Pi boards load from separate `start.elf` files. The firmware's Arm startup code, called its **Arm stub**, runs before handing control to our image's `_start`.\n\nThe next lesson supplies a raw image: instruction and data bytes without ELF loading information. The firmware configuration and linker script must agree about where those bytes go. Our startup then prepares its own stack and clears `.bss`, as it did in QEMU.\n\nThe Pi's firmware and devices belong to this board. Reusing QEMU's UART address or assuming its initial processor state would not port the program.",
  reflection:
    "Open the two `trip_distance.s` files, from Module 12 and the Pi bundle in the next lesson. The arithmetic instructions stay the same. Identify the files that instead choose the load address, prepare startup and send the report. Those are the parts to inspect when moving this function to another board.",
  modelVsReality: "",
  originalityNote: {
    textbookExample: "A bare-metal board exercise that begins again with an unrelated greeting.",
    howThisDiffers:
      "The learner ports the already tested trip function from the preceding QEMU capstone. Connection and boot-chain schematics separate unchanged arithmetic from firmware loading, board startup and serial output.",
  },
} as const;
