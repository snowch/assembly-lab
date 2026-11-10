// Copyright © 2026 Christopher Snow
unsigned float_pattern(float distance)
{
    unsigned pattern;
    __builtin_memcpy(&pattern, &distance, sizeof pattern);
    return pattern;
}
