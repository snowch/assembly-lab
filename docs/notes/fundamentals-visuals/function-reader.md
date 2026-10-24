# A tiny function: independent learner and built-page review

Reviewed by a separate reader session, 24 October 2026. Prerequisites limited to the front
page's C expectations and One addition. No product files edited during this review.

## Evidence

Read the complete rendered lesson at http://localhost:4324/assembly-lab/#/lesson/tiny-function,
including objectives, all section bodies, the worked figure, fresh exercise, reflection and
model-versus-reality note. Used Chromium at 375, 768 and 1280 CSS pixels in light and dark;
checked the actual `html[data-theme]` each time. All six contexts passed without page errors
or document-level horizontal overflow.

In every context checked initial state, addition, paused reload, return, returned reload and
Start again. The argument starts in w0; addition prepares the increased value while the caller
still says “Waiting”. Only the second step changes the caller to “Resumed with result”. The
register is not marked Written on return. Reset restores the incoming argument and waiting
caller. Both complete source panes remain present and aligned: four numbered C rows, two
instructions and their checked C-line associations. Raw compiler references start closed.

The 375-pixel listing measured 302 pixels wide with 588 pixels of content. Scrolling reached
the instruction pane, and ArrowLeft after focusing the listing moved only its local horizontal
position. At 768 and 1280 pixels both panes fit and there were no navigation buttons. At all
widths the obsolete Show C / Show instructions controls were absent.

Visually inspected the full light tablet page and the dark phone returned figure. Three
visible main section headings divide the small example from its practice and reflection;
supporting paragraphs no longer have repeated visual labels/borders. The retained accessible
headings remain in the document. The argument arrow is solid; the returned path is dashed,
points toward the caller and says “Return to caller”. Nearby text explicitly says ret leaves
w0 unchanged. Contrast and arrowheads remain readable in the inspected dark phone image.

Artifacts: /tmp/function-review-results.json, /tmp/function-review-text.txt,
/tmp/function-review-page.png, /tmp/function-review-{light,dark}-{375,768,1280}.png.

## Findings and assumed knowledge

No blocking learner finding in this scope. No fresh challenge answer appears in the worked
visual or surrounding introductory prose. The exercise uses a different argument; its input
remains separate from the visible worked call. This review read the exercise but did not submit
or reveal its reference answer; automated grading coverage belongs to the parent validation.

The page needs C functions and integer return expressions, supplied by the front-page
prerequisites; registers, operand order and add come from One addition. It defines caller,
argument and listing locally. GCC is introduced as a compiler, the colon is tied to the named
function, the literal final operand is explained before use, and the model-versus-reality note
explains the optimisation setting where it first appears. No new unexplained term was found
that blocks following this example. The simulator-supplied call deliberately avoids untaught
call instructions and return-address machinery.

The mechanism is defined in the short introduction, demonstrated in one complete tiny function,
and practised with a fresh argument. A smaller arithmetic-only example would not demonstrate
waiting versus returning; the prior addition supplies the arithmetic prerequisite. The tiny
function therefore provides the bridge needed before composition with the trip calculation.

## Closing passes

Sentence pass: direct instructions and local definitions survive the reduction; no technical
qualification depends on an optional disclosure. Explanation pass: the visual distinguishes
prepared result from return, and the exercise can be attempted with the taught operand and
calling rules. No request to reinstate the removed navigation toggles or repeated headings.

Limit: this is a lesson-specific Chromium review, not a whole-course or hardware certificate.
