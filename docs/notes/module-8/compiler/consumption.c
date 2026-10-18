// Copyright © 2026 Christopher Snow
unsigned long consumption(unsigned fuel, unsigned distance)
{
    if (distance == 0) return 0;
    return (unsigned long)fuel * 100 / distance;
}
