// Copyright © 2026 Christopher Snow
unsigned dim_up(
    unsigned brightness, unsigned start,
    unsigned end)
{
    for (unsigned tick = start;
         tick < end;
         tick++)
        brightness >>= 1;
    return brightness;
}
