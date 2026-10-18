// Copyright © 2026 Christopher Snow
unsigned fade_sum(unsigned brightness)
{
    if (brightness == 0)
        return 0;
    return brightness + fade_sum(brightness >> 1);
}
