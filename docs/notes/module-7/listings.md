# Module 7 recorded listings

GCC 16.1.0, carm64g1610, -O1. Raw source and API records are in compiler/.

## READ_TRIP

```c
unsigned read_trip(const unsigned *trips, unsigned long index)
{
    return trips[index];
}
```

```asm
read_trip:
ldr w0, [x0, x1, lsl 2] C4
ret C4
```

## SUM_TRIPS

```c
unsigned sum_trips(const unsigned *trips, unsigned count)
{
    unsigned total = 0;
    while (count != 0) {
        total += *trips++;
        count--;
    }
    return total;
}
```

```asm
sum_trips:
mov x2, x0 C2
cbz w1, .L4 C4
add x3, x0, w1, uxtw 2 C4
mov w0, 0 C3
.L3:
ldr w1, [x2], 4 C5
add w0, w0, w1 C5
cmp x2, x3 C4
bne .L3 C4
.L1:
ret C9
.L4:
mov w0, w1 C3
b .L1 C8
```

## LABEL_LENGTH

```c
unsigned long label_length(const unsigned char *label, unsigned long capacity)
{
    unsigned long length = 0;
    while (length < capacity) {
        if (label[length] == 0) break;
        length++;
    }
    return length;
}
```

```asm
label_length:
mov x3, x0 C2
cbz x1, .L2 C4
mov x0, 0 C3
.L4:
ldrb w2, [x3, x0] C5
cbz w2, .L1 C5
add x0, x0, 1 C6
cmp x1, x0 C4
bne .L4 C4
.L2:
mov x0, x1 C3
.L1:
ret C9
```
