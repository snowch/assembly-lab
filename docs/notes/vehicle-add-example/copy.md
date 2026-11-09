## Heading

Add a route leg

## Main explanation

Suppose a known route leg is 4096 metres long. Add it to the trip total: `trip_metres + 4096`.

A compiler or assembly programmer can do this with one `add` instruction. Here, `lsl #12` turns the constant 1 into 4096.

Here, `w0` holds `trip_metres`; `add` writes the new total to `w2`.

## Caption

One add instruction adds the route leg to the trip total.

## Optional note

Constant range and shift limits

In this form of `add`, the constant before `lsl` ranges from 0 to 4095. The only optional `lsl` amounts are 0 and 12; omitting `lsl` uses the constant unchanged. These options differ from those of `mov` and `movk`.

See [Arm’s ADD (immediate) reference](https://developer.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ADD--immediate---Add-immediate-value-).
