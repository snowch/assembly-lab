// Copyright © 2026 Christopher Snow
unsigned course_for_assignment(unsigned count, unsigned rate)
{
    unsigned i = 0;
    unsigned total = 0;
    for (i = 0; i < count; i = i + 1) {
        total = total + rate;
    }
    return total;
}
