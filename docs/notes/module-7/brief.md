# Module 7 engineering and prose brief

Learner prerequisites: Modules 0–6. Registers/flags, loops, ldr/ldrb/str widths,
64-bit pointer arguments and little-endian byte diagrams taught. New terms: array,
element, index, pre-index, post-index (L1); string, terminator (L2). No new mnemonic.
All numbers below checked in arrays.facts.test.ts and differential corpus.

Compiler: GCC 16.1.0 carm64g1610 -O1. Three exact requests/responses in compiler/.
read_trip uses [x0,x1,lsl 2]. sum_trips uses post-index load and an end pointer;
add x3,x0,w1,uxtw 2 zero-extends 32-bit count then scales by four. label_length
uses bounded unsigned-long count and [x3,x0] byte indexing. C break exits nearest
loop; explain before listing. This bounded scan returns capacity if no zero occurs.

L1 array-addresses: unsigned trip log [12,25,7,40], 4 bytes per element, index 0
first; index 2 at base+8 yields7. C p+1 advances one element, not universally a byte.
Valid indices only, no C out-of-bounds demonstration. Prediction read_trip(2)=7.
Compare OFFSET, PRE_INDEX, POST_INDEX from same base: respectively load25/base
unchanged; load25/base+4; load12/base+4. Show x0,w2 plus highlighted bytes in memory
stepper. Registers and highlighting come from model; no new UI strings.
Construction read_trip takes x0 base,x1 index; write ldr scaled+ret. Five cases.
Failure WRONG_SCALE index2 loads bytes 00 00 19 00 =>0x00190000=1638400, within
valid 16-byte model fixture. Present course assembly error, not undefined C output.
Explanation compare memory address and pointer update; generalisation GCC sum_trips
count3 yields44 and x2 base+12; count0 no load, result0. Final write-sum-trips:
x0 base,w1 count; unsigned total returnedw0, countzero mustloadnothing, memory
unchanged, up to4entries. Sum modulo2^32. Pointer may end one past array but cannot
be dereferenced there. C *trips++ dereferences old pointer then advances oneelement.

L2 zero-terminated-strings: ASCII fixture "A-B-C": bytes65,45,66,45,67,0,88,0.
Explain ASCII maps these letters/dash to bytes, actual encoding general/notalltext
onebytepercharacter. Zero byte marksend; ASCII digit0 byte48 is not terminator.
C strings are character arrays with zero byte; this code acceptsunsignedchar byte
array. Bytesafterfirstzero are notpartoflabel. Count excludeszero.
Compiler label_length(x0, x1capacity) returnsx0: bound preventsreadingbeyondcapacity;
capacity mustnotexceedreadableobjectsize; zero allowedandthen no load.
Prediction fixture,capacity8 =>5. Walk authored WALK_LABEL confirms advancingone
byte and stopzero; emptyfixture[0,88] yields0. Construction write-label-length
boundedscan with samecontractascompiler (5cases, includeszero capacity and missing
zero withincapacity). Failure WRONG_TERMINATOR addsbeforezero test, returns6 for
samefixture, emptyreturns1. Predict6, theninspect gatedstepper.
Explanation countonthenonzeropath; character countversusbytecount, ASCII scope.
Generalisation stop rule and boundary; bounded missingzero fixture[65,66,67],cap3
returns3, doesnotclaimthatinputisaCstring. Final countmarker x0 terminatedlabel,
w1 nonzero ASCII marker, returnw0occurrencesbeforefirstzero. Fixtures validterminated;
emptylabel and postterminatormarker, repeatedmarker and literalASCIIzero covered.

C sources: N3096 6.5.2.1 array subscripting, 6.5.6 pointer arithmetic within array
and one-past, 6.4.5 string literal terminating zero, 7.1.1 definition of string,
6.8.6.3 break, 6.2.5 unsigned modular arithmetic. Simulator fixed memory map and
no C object bounds; invalid C access not inferred from readable simulator memory.
