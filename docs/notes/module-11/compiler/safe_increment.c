// Copyright © 2026 Christopher Snow
#include <limits.h>
int safe_increment(int distance)
{
    if (distance == INT_MAX)
        return distance;
    return distance + 1;
}
