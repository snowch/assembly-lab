// Copyright © 2026 Christopher Snow
int trip_distance(int leg1, int leg2, int leg3, int detour)
{
    int total = leg1 + leg2;
    total = total + leg3;
    total = total - detour;
    return total;
}
