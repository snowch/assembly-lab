// Copyright © 2026 Christopher Snow
unsigned cap_charge(unsigned distance, unsigned rate, unsigned limit)
{
    unsigned charge = distance * rate;
    if (charge > limit) {
        charge = limit;
    }
    return charge;
}
