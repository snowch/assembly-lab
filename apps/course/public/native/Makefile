# Copyright © 2026 Christopher Snow
AS = aarch64-linux-gnu-as
LD = aarch64-linux-gnu-ld
CC = aarch64-linux-gnu-gcc
QEMU = qemu-system-aarch64
QEMU_FLAGS = -M virt -cpu cortex-a53 -m 128M -nographic
.PHONY: all run debug clean
all: boot.elf
boot.o: boot.s
	$(AS) -g $< -o $@
trip_distance.o: trip_distance.s
	$(AS) -g $< -o $@
boot.elf: boot.o trip_distance.o boot.ld
	$(LD) -T boot.ld boot.o trip_distance.o -o $@
challenge.elf: verify-boot.s boot.s boot.ld trip_distance.o
	$(AS) -g verify-boot.s -o verify-boot.o
	$(LD) -T boot.ld verify-boot.o trip_distance.o -o $@
run: boot.elf
	$(QEMU) $(QEMU_FLAGS) -kernel boot.elf
debug: boot.elf
	$(QEMU) $(QEMU_FLAGS) -kernel boot.elf -S -gdb tcp:127.0.0.1:1234
# Optional comparisons: these targets need Linux user-mode QEMU and/or GCC.
trip: main.c trip_distance.s
	$(CC) -static -g -O0 -no-pie main.c trip_distance.s -o trip
standalone: standalone.s
	$(AS) -g standalone.s -o standalone.o
	$(LD) -e _start standalone.o -o standalone
challenge: verify-challenge.c trip_distance.s
	$(CC) -static -g -O0 -no-pie verify-challenge.c trip_distance.s -o challenge
clean:
	rm -f trip standalone challenge boot.elf challenge.elf *.o
