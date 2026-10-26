# Copyright © 2026 Christopher Snow
AS = aarch64-linux-gnu-as
LD = aarch64-linux-gnu-ld
OBJCOPY = aarch64-linux-gnu-objcopy
.PHONY: all card-files clean
all: assembly-lab-pi5.img
boot.o: boot.s
	$(AS) -g $< -o $@
trip_distance.o: trip_distance.s
	$(AS) -g $< -o $@
boot.elf: boot.o trip_distance.o boot.ld
	$(LD) -T boot.ld boot.o trip_distance.o -o $@
assembly-lab-pi5.img: boot.elf
	$(OBJCOPY) -O binary $< $@
# Stage the two boot files. Nothing writes to a card or device.
card-files: assembly-lab-pi5.img
	mkdir -p card-files
	cp config.txt assembly-lab-pi5.img card-files/
	cd card-files && sha256sum config.txt assembly-lab-pi5.img > SHA256SUMS
clean:
	rm -f *.o boot.elf assembly-lab-pi5.img
	rm -rf card-files
