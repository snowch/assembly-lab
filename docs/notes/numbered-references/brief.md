# Typed trip results and numbered references

Copyright © 2026 Christopher Snow

## Accepted learning change

The comparison needs an application contract: a planned distance and a travelled distance, with exceeding the plan expressible as a signed negative remaining distance. With the existing recorded calls, the signed return can mean distance beyond the plan. Unsigned wrapping remains defined C arithmetic but does not express that overrun usefully for this contract. An ordinary returned unsigned number does not report whether wrapping occurred. The existing `sub` and `ret` do not update condition flags; do not introduce an unrelated flags tutorial here. Instructions and source recordings stay unchanged.

Show the application meaning alongside the computed results after execution, alongside the already worked signed/unsigned weights. Keep initial inputs, prediction gating, reset and restoration. Distinguish bits and their reading from the program designer's chosen behaviour. A valid C result is not necessarily useful for the function's intended task. Conclude with choosing negative/zero/error behaviour and one short application of a check before subtraction; avoid another full subtraction exercise or teaching later branch instructions.

Checked sources: existing recorded GCC functions and model tests in module-1/c-types-subtraction; C23 N3096 §§6.2.5p11 and 6.5p5; existing simulator operation implementation and GNU/QEMU agreement. Prerequisites: Module0 arguments, return and register arithmetic; Module1 signed/unsigned weights and four-place subtraction.

## Reference navigation

The user's observed difficulty is locating a linked lesson relative to the current page. Introduce visible current module/lesson position and label internal forward/back lesson links with module, one-based within-module lesson ordinal and readable title. Use actual published order and module labels, including A/B appendices. Derive numbers from data rather than duplicating them in authored prose. Keep stable URLs, authored titles, C source and external links unchanged. The course plan and previous/next navigation must use the same numbering as inline references. Do not edit the shared platform copy or use post-render DOM mutation.

## Review evidence

Separate agents draft/implement the copy and navigation. Root checks accuracy and integration. Independent reviews inspect both the essential teaching route and generated reference numbers at phone/desktop widths in rendered light/dark themes. Test reordering/appendix labels, actual link destinations, no duplicated numbers, unchanged external links, gates and restored states. Record source-only and browser evidence separately. No novice learning study is available.
