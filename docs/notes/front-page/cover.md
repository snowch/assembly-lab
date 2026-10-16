# The cover's program

The front page's live cover steps this function. It is in no lesson, and uses only additions, so it gives away no lesson's prediction or challenge (Module 0's review, finding 23). Fetched 16 October 2026 from Compiler Explorer, ARM64 GCC 16.1.0 (`carm64g1610`), flags `-O1`. The cover calls `fuel_on_board(38, 6, 10)`: `w0` is 38, then 44, then 54.

```c
// Copyright © 2026 Christopher Snow
int fuel_on_board(int tank, int reserve, int can)
{
    int litres = tank + reserve;
    return litres + can;
}
```

```
fuel_on_board:                      
        add     w0, w0, w1            C4
        add     w0, w0, w2            C6
        ret                           C6
```
