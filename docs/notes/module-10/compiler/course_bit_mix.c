// Copyright © 2026 Christopher Snow
unsigned course_bit_mix(unsigned a, unsigned b)
{
    return ((a & b) | (a ^ b)) + ~a;
}
