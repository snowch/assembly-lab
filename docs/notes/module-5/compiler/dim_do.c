// Copyright © 2026 Christopher Snow
unsigned dim_do(
    unsigned brightness, unsigned ticks)
{
    do {
        brightness >>= 1;
        ticks--;
    } while (ticks != 0);
    return brightness;
}
