// Copyright © 2026 Christopher Snow
#include <stdio.h>
extern int trip_distance(int, int, int, int);
int main(void) {
    const int cases[][5] = {
        {120, 85, 42, 15, 217}, {7, 9, 4, 2, 16},
        {0, 0, 0, 0, 0}, {0, 0, 0, 1, -2}
    };
    int failures = 0;
    for (unsigned i = 0; i < sizeof cases / sizeof cases[0]; ++i) {
        const int *c = cases[i];
        int got = trip_distance(c[0], c[1], c[2], c[3]);
        if (got != c[4]) {
            printf("case %u: got %d, expected %d\n", i + 1, got, c[4]);
            ++failures;
        }
    }
    if (!failures) puts("4 cases passed");
    return failures != 0;
}
