// Copyright © 2026 Christopher Snow
unsigned sum_trips(const unsigned *trips, unsigned count)
{
    unsigned total = 0;
    while (count != 0) {
        total += *trips++;
        count--;
    }
    return total;
}
