// Copyright © 2026 Christopher Snow
unsigned course_while(unsigned value, unsigned count)
{
    while (count != 0) {
        value = value >> 1;
        count--;
    }
    return value;
}
