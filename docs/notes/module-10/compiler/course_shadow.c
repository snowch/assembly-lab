// Copyright © 2026 Christopher Snow
unsigned course_shadow(unsigned a)
{
    unsigned b = 7;
    {
        unsigned b = a + 1;
        a = b;
    }
    return a + b;
}
