// Copyright © 2026 Christopher Snow
unsigned course_else(unsigned a, unsigned b)
{
    if (a < b) {
        return b - a;
    } else {
        return (a - b) << 1;
    }
}
