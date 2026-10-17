// Copyright © 2026 Christopher Snow
unsigned dim_until_dark(unsigned brightness, unsigned ticks)
{
    while (ticks != 0 && brightness != 0) {
        brightness >>= 1;
        ticks--;
    }
    return brightness;
}
