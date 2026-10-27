# Primitive activity labels: canonical prose

Copyright © 2026 Christopher Snow

Separately drafted shared labels for the small arithmetic and function figures. Parameterised examples below instantiate the same messages used in the figures; arithmetic results come from checked traces.

## before

Before the instruction

## current

Registers now

## instruction

Instruction

## nextInstruction

Runs next

## ranInstruction

Just ran

## run

Run the instruction

## check

Check and run

## restart

Start again

## answer

Your prediction

## correct

Your prediction matched.

## incorrect

Compare your prediction with the result.

## input

Input

## constant

Constant

## output

Destination written

## outputPending

Destination

## stopped

The activity stops after the instructions shown.

## caller

Caller

## callerWaiting

Waiting

## functionEntry

The argument is in w0. Run add to prepare the result.

## functionAfterAdd

The result is in w0. Run ret to return to the caller.

## functionReturned

ret returned to the caller. It left w0 unchanged.

## argumentPath

Argument

## returnPath

Return to caller

## result

Result

## resultReady

Result ready

## question("w0")

What value will w0 hold after this instruction?

## question("w1")

What value will w1 hold after this instruction?

## unchanged("w1")

w1 keeps its value.

## unchanged("w0, w1")

w0, w1 keep their values.

## reused("w0")

w0 supplies its old value before the instruction writes its result there.

## callerCall("increment_int", 7)

increment_int(7)

## callerCall("increment_int", [7])

increment_int(7)

## callerCall("add_ints", [7,5])

add_ints(7, 5)

## callerReturned(8)

Resumed with result: 8

## callerReturned(12)

Resumed with result: 12

## functionEntryMany("w0 and w1")

The arguments are in w0 and w1. Run add to prepare the result.

## argumentPathAt(0)

First argument

## argumentPathAt(1)

Second argument

## argumentPathAt(2)

Third argument

## argumentPathAt(3)

Argument 4
