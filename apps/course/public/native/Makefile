# Copyright © 2026 Christopher Snow
CC = aarch64-linux-gnu-gcc
AS = aarch64-linux-gnu-as
LD = aarch64-linux-gnu-ld
.PHONY: all run check clean
all: trip standalone
trip: main.c trip_distance.s
	$(CC) -static -g -O0 -no-pie main.c trip_distance.s -o trip
standalone: standalone.s
	$(AS) -g standalone.s -o standalone.o
	$(LD) -e _start standalone.o -o standalone
boot.elf: boot.s boot.ld
	$(AS) -g boot.s -o boot.o
	$(LD) -T boot.ld boot.o -o boot.elf
challenge: verify-challenge.c trip_distance.s
	$(CC) -static -g -O0 -no-pie verify-challenge.c trip_distance.s -o challenge
run: trip
	qemu-aarch64 ./trip
check: challenge
	qemu-aarch64 ./challenge
clean:
	rm -f trip standalone challenge boot.elf *.o
