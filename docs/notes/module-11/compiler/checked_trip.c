// Copyright © 2026 Christopher Snow
#include <stdckdint.h>
_Bool checked_trip(int distance, int adjustment, int *result)
{
    return ckd_add(result, distance, adjustment);
}
