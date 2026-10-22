// Copyright © 2026 Christopher Snow
#include <stdio.h>
extern int trip_distance(int leg1, int leg2, int leg3, int correction);
int main(void) {
    int result = trip_distance(120, 85, 42, 15);
    printf("trip_distance(120, 85, 42, 15) = %d\n", result);
    return result != 232;
}
