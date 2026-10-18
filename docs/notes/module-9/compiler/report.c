// Copyright © 2026 Christopher Snow
unsigned half_distance(unsigned distance)
{
    return distance >> 1;
}
unsigned trip_report(unsigned distance, unsigned reserve)
{
    return half_distance(distance) + reserve;
}
