# Module 9 checked drafting facts and interface

## Sources and prerequisites

Earlier modules teach integer registers, x/w aliasing, unsigned wrap, arithmetic, flags, branches,
loops, memory, widths, array address arithmetic and pre/post-index address syntax. Do not assume
calling-convention vocabulary, recursion, compiler inlining or a stack frame.

Compiler evidence: compiler/report and compiler/fade-sum, GCC 16.1.0 carm64g1610, flags
`-O1 -fno-inline`. The extra flag prevents replacement of a call by the helper's body. Raw request
and response are retained. C source excludes the copyright line when displayed; each GCC source
line number is reduced by one. GCC report returns 73 for distance128/reserve9 in 11instructions;
its frame uses32bytes. The course-authored exercise helper additionally writes w1=0: this is legal
and exposes reliance on a caller-saved register. Never attribute that variation to GCC.

AAPCS64 release2025Q4 raw source fetched successfully:
https://raw.githubusercontent.com/ARM-software/abi-aa/2025Q4/aapcs64/aapcs64.rst
§6.1.1: x0–x7 parameter/result registers, caller cannot rely on argument/scratch registers surviving
calls; x19–x29 and SP must be preserved (all64bits). x18 platform-specific, avoid here. x29 frame
pointer, x30 link register. §6.4.5 universal stack constraints: stack descends, memory below SP
outside active stack, SP mod16=0 when accessing memory through SP; public-interface alignment also16.
Frame-record requirement varies with platform; do not claim every function has a frame pointer.
§6.5 BL writes sequential PC to LR and branches; RET uses LR by default. BL does NOT save old LR
or stack allocate automatically. Saving/restoring are program instructions. Leaf calls nofunction;
nonleaf calls another. Registers are physical64bits: saving w19 would not preserve upperhalf.

Model checks: initialSP4390912 (0x430000), report minimumSP4390880. fade_sum(7) calls with
7,3,1,0; result11,48instructions, four32byte frames peak128bytes. fade_sum(0) stillallocates
GCC32byteframe, result0. unsigned accumulation wraps if needed. A recursive call makes a new
invocation and returns before pending addition executes. Base case zero stops; rightshift1 reaches
zero for every32bitunsigned input within32shifts. Max33invocations. Model step budget limits traces;
wrong program keeping brightnessunchanged has no progress and eventually exhausts real finite stack.
No claim of infinite completed run.

## Files and exact prose keys

Use calls-and-returns.prose.ts/.labels.ts and recursive-calls.prose.ts/.labels.ts.
PROSE standard keys: question,motivation,prediction,investigation,construction,failureExperiment,
explanation,generalisation,reflection, predictionQuestion,predictionExplain,failureQuestion,
failureExplain,writeTask,finalTask,writeHints[5],finalHints[5],modelVsReality,originalityNote.
Optional standard questionNoteSummary/questionNote and reflectionNoteSummary/reflectionNote used.
LABELS: title,objectives[], titles[tenstandardsections], captions{listing,predict,step,investigate,
write,predictFailure,stepFailure,final}, options{prediction[],failure[]} and challenges{write:{title,
tests[5]},final:{title,tests[5]}}. Options have value,label.

L1 section plan:
question compiler REPORT listing; motivation savedreturnneeded; prediction model-based returnvalue
REPORT(128,9), options values73,64,137, correctnotfirst; step and investigation stack-stepper same
program gatedonprediction. Explain stack,stp/ldp,x29,x30,x19 beforeconstruction so exercisepossible.
Construction `write-call-report`: authored report_once(distance)=half_distance(distance)+1,
helper lsr+ret provided; starter omits saving x30. Inputs0,1,7,128,0xffffffff; outputs1,1,4,65,
2147483648. Contract preserve x19,x29,SP. Use16byte savepair x29,x30 and movx29,sp, restorepair.
Failure: wrong report_once missinglinksave predicted stop after20instructions, options returned/limit;
gatedstackstepper shows x30targetstuck and repeatadd. Explain retdoesnotnecessarilyendwholeprogram.
Final `write-preserve-reserve`: authored helper lsr+movw1zero+ret; report must add originalreserve.
Given(distance,reserve)=(0,9),(1,0),(7,2),(128,9),(0xffffffff,0xffffffff), expected9,0,5,73,
2147483646. Preserve fullx19,x29,SP. Starter saveslinkbutusesw1afterhelper.
Generalisation caller/callee responsibilities and register subsets. No ABI rule saysw1keepsvalue.

L2 sectionplan:
question GCCFADE_SUM C/listing, define recursionandbasecase; prediction returnfade_sum7, options7,
11,3 correctsecond; gate stack-stepper and another investigation presetphasepeak, show fourframes
and pending sums. Construction `write-fade-sum`: useprovidedGCCassembly butwrongcbz in placecbnz;
fixbranch, preserveeachinvocationx19,x29,SP. Inputs0,1,7,128,0xffffffff ->0,1,11,255,4294967262.
Failure authoredsameassembly but replace lsrw0,w0,1 withmovw0,w0; predict limit32 vsreturned;
stepper limited32showsstackgrowth andunchangedw0. Feedbacksayrecordinglimit, finiteactualstack.
Final `write-lit-count`: recursive count of nonzero brightnesslevels (7→3→1 counts3;0counts0).
Starter cbzdone; savepair16; shift; blself; restorepair;ret. Missing increment afterchildreturns.
Inputs0,1,7,128,0xffffffff ->0,1,3,8,32. Preservex19,x29,SP. Explain recurrence beforeexercise,
and why addition must happenaftercall (w0childresult). Reference preserveslink and restorestack.

## New figure strings

packages/views/src/strings.stack.ts export STACK_STRINGS keys:
stack (group aria/title), empty (noactiveframes), lower (growthdirection text),
frame(name:string,bytes:number), address(value:string), byte(address:string,value:string),
position (range sliderlabel), depth(bytes:number), active (currentlyallocated caption),
sp (SP label), instructions (listingsection accessible label ifneeded).
Figure uses existing steppercontrol/status strings; owntexts onlyfromthisfile.
Figure shows listingandC, next/back/reset, instruction range slider, selectedx/wregs,
sp, activeallocatedframes containingaddressedbytes fromactualtrace. Frame labels identifyfunction;
framesvanishonrestorebutstoresarenotcleared. No claimdiagramshowsallrealstackmachinery.
