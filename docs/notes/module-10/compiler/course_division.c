// Copyright © 2026 Christopher Snow
unsigned course_division(unsigned a, unsigned b)
{
    if (b == 0) return 0;
    return a / b + a % b;
}
