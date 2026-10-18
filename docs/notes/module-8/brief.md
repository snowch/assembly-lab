# Module 8 fact brief

Prerequisites: Modules 0–7, including low32/wide64 views, shifts, unsigned wrap, signed range,
branches and loads. Trip computer input unsigned values represent totals in fixed units.
Read CLAUDE.md, docs/style.md, docs/sources.md. Numeric results below are from facts.md model runs.

## Products and widths

Order: low32 mul prediction; step; madd listing and step before construction; construction
scaled_total; wrong narrow product before widening prediction; step; smull versus umull;
msub demonstration; 128-bit product halves; final unsigned32×32→64 exercise.

Prediction SCALE_PULSES(2147483648,2), inspect w0: 0x00000000. Options values need padded8hex.
Failure WIDE_TOO_LATE(4294967295,2), inspect x0: 0x00000000fffffffe. Options padded16hex.
No results in pre-prediction prose/captions. Inputs are public. Same gate unlocks other L1 figures.
MADD figure SCALED_TOTAL(7,6,10), output52. msub SUBTRACT_PRODUCT(100,7,6), output58.
WIDE_UNSIGNED(4294967295,2) gives x0=8589934590. WIDE_SIGNED(-1,2) gives -2.
C long/unsigned long are64 for this target, unsigned/int32. A cast changes operand before multiply;
casting already-wrapped32 result cannot recover highbits. Signed32overflow Cundefined.
A64 mul lowbits unaffected by signedinterpretation, madd multiplies sources2/3 then adds4;
msub subtracts that product FROM fourthoperand. These instructions leave NZCV unchanged.
smull andumull read32 andwrite64; smulh andumulh read64 andwritehigh64 of128bitproduct.
Product-halves diagram runs courseassembly with x0=0xffffffffffffffff,x1=2; x2 commonlow
0xfffffffffffffffe, x3unsignedhigh1,x4signedhigh0xffffffffffffffff. Full128 bar split high64/low64.
Explain highhalf signed read is not signextending lowhalf; fullproduct sign determines highbits.
New terms: product, high half, low half. C casts previously taught but widening timing isnew.

write-scaled-total: w0=pulses,w1=scale,w2=total; return low32(total+pulses*scale) w0.
Reference madd w0,w0,w1,w2;ret. Allowed mul,madd,add,ret. Tests in order:
(7,6,10),(4294967295,2,5),(0,3,7),(2147483648,2,0),(1,1,4294967295).
write-wide-product: unsignedw0,w1 productreturnedfull64x0; reference umullx0,w0,w1;ret.
Allowed mul,umull,smull,ret. Tests: (4294967295,2),(4294967295,4294967295),(2147483648,2),(0,4294967295),(7,6).

## Division and remainders

Prediction QUOTIENT_SIGNED(-17,5), w0=0xfffffffd (-3). Explain quotientwholeanswertruncatedtoward0.
Investigation signedremainder(-17,5), returns-2: sdivw2,w0,w1;msubw0,w2,w1,w0.
Identity n=q*d+r indefinedCcases. remainder zero orsame sign asdividend. Signed vsunsignedinstructions.
write-remainder: signedw0total/w1count, returnremainderw0; divisor nonzero, excludesINTMIN/-1.
Allowed sdiv,udiv,msub,mul,sub,ret. Tests (-17,5),(17,5),(17,-5),(-17,-5),(0,5),(2147483647,7),(-2147483648,7).
Failure WRONG_REMAINDER(-17,5) replaces sdivwithudiv, remainder4 (0x00000004).
Explain samebits dividedunsigned is4294967279; udivquotient858993455; remainder4.
A64 zero divisor returns0 quotient, noexception. SignedMIN/-1 returnsMINbitpattern. NeitherchangesNZCV.
C standard N3096 6.5.5p6 divisionbyzero undefined, p7 fractionaldiscarded; unrepresentable quotient makes / and % undefined.
Show two DIVIDE_EDGES steps: (17,0), (INTMIN,-1). These are ASSEMBLYexperiments, noCattached.
Constantdivision actual GCC16.1-O1 GROUPS_OF_TEN(12345) uses0xcccccccd andumull thenlsr35;
result1234. Usesfullproduct so upperbitsnotlost. Record is onecompilerchoice, no claimfaster.
Optional note why identity exact for32unsigned: reciprocal2^35/10 roundedup; the small positive
error stays below nextquotient boundary across uint32. No requirementderive magicconstant.
final write-consumption: w0unsignedfuel millilitres,w1unsigneddistance metres; returnx0
whole millilitres per100metres = floor(fuel*100/distance). distance0 returns0 convention preventsdivide.
Maxproduct429496729500 fits64; maxinput32. Explicitcourseassembly, GCCcandidate rejectedubfiz/uxtwuntaught.
Reference cbzw1zero;movw2#100;umullx0w0w2;movw1w1;udivx0x0x1;ret;zero:movx0#0;ret.
movw1,w1 clears upper32 beforex1divide (alreadytrue initially but guaranteedbyinstruction).
Allowed cbz,mov,mul,umull,udiv,ret. Tests (600,1000),(4294967295,100),(4294967295,1),(0,1),(600,0),(1,3),(4294967295,4294967295).
L2 terms quotient,remainder. Make no timingclaims. A64 exceptions differentiateCUB explicitly.
