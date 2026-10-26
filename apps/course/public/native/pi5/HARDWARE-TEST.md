# Raspberry Pi 5 hardware test record

Copyright © 2026 Christopher Snow

**Hardware verification is pending.** The source has been prepared for the Pi 5's dedicated UART connector and official Debug Probe. File checks do not establish a successful boot or readable serial output. Fill in observed results below; leave unobserved stages marked **unverified**.

Use the course's two Module 13 lessons for preparation, build and terminal commands. Keep your normal Raspberry Pi OS card separate. Use a spare card for this test. Connect the supplied three-pin cable between the probe's **U** socket and the Pi's **UART** socket with power disconnected. The probe is USB-powered; power the Pi with its usual supply.

## Identify the setup

Record before changing cards:

- Pi model and board revision:
- EEPROM bootloader version and configuration:
- Debug Probe firmware version, if known:
- Pi power supply:
- Host operating system and serial-terminal version:
- Host serial-device path:
- Source commit or downloaded course build:

If your usual Raspberry Pi OS card is available, use these read-only commands there before swapping it out:

```sh
cat /sys/firmware/devicetree/base/model
sudo rpi-eeprom-update
rpi-eeprom-config
```

Keep the displayed model, current bootloader version and configuration. Do not add update or edit flags. If an item is unavailable, record **unknown**. Use the commit in the course footer as the source revision for a downloaded bundle.

The selected path is normal microSD boot. This exercise does not ask you to change EEPROM settings, install new EEPROM firmware, or alter secure boot. If that path does not work with your normal card, resolve it before testing this image.

## Identify the image

In the extracted source directory, record the output of:

```sh
sha256sum assembly-lab-pi5.img
cat card-files/SHA256SUMS
```

Record tool versions from:

```sh
aarch64-linux-gnu-as --version
aarch64-linux-gnu-ld --version
aarch64-linux-gnu-objcopy --version
```

Check the card's first FAT32 partition contains the selected files at its root:

- `config.txt`
- `assembly-lab-pi5.img`

The configuration and linker script both select `0x200000`. The image is raw bytes, so it carries no ELF loading metadata. `device_tree=` selects the documented no-device-tree path for this small bare-metal program. No separate `start.elf` or `fixup.dat` files are part of this Pi 5 manifest.

`uart_2ndstage=1` requests firmware diagnostics. This example inherits the firmware's preparation of the dedicated UART path. Its clock and connector routing still require confirmation on the actual board. A QEMU run does not check those conditions.

## Capture the three runs

Use 115200 bits per second, eight data bits, no parity, one stop bit and no flow control. Connect the terminal before powering the Pi. Preserve the raw serial capture, including any firmware messages, rather than writing only your interpretation.

### Original function

- Image checksum:
- Powered-off cable and card check completed:
- Actual entry-level line, if present:
- Actual trip-check line, if present:
- Serial-capture filename:
- Result: **unverified / observed pass / observed failure**

The program reads its actual processor privilege level, called its exception level, and is written to report it before the trip-check line. Do not fill in a level from QEMU or from an assumed firmware default.

### Deliberately broken function

Change only the third arithmetic instruction from `sub w0, w0, w3` to `add w0, w0, w3`. Rebuild, replace the card image and boot from power-off.

- New image checksum:
- Actual entry-level line, if present:
- Actual trip-check line, if present:
- Serial-capture filename:
- Did the caller report failure? **unverified / yes / no**

### Restored function

Restore the subtraction, rebuild, replace the card image and boot from power-off.

- Restored image checksum:
- Actual trip-check line, if present:
- Serial-capture filename:
- Did the caller report success? **unverified / yes / no**
- Did the same restored image report success after another power cycle? **unverified / yes / no**

A changed source file does not change a card image or a running Pi. Keep the checksums and captures attached to their own runs.

## What the evidence establishes

A readable Assembly Lab line establishes that our code reached serial output in that setup. A passing trip check establishes that the caller accepted its supplied test inputs. An observed failure for the broken image and success after restoration distinguish the calculation check from an unconditional greeting.

An empty serial capture does not identify the failing stage. It may involve host access, cable, card loading, startup, UART preparation or the program. The supplied startup stops without output if its entry-condition checks fail. Record which observations you have and which stages remain unverified.

This connection is UART serial. It does not provide a physical GDB instruction-stepping session for the Pi. The course's earlier GDB recording is from QEMU.
