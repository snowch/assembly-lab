// Copyright © 2026 Christopher Snow
unsigned accumulated_charge(unsigned count, unsigned rate)
{
    unsigned total = 0;
    for (unsigned i = 0; i < count; i++) {
        total = total + rate;
    }
    return total;
}
