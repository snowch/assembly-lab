---
name: learning-design
description: Plan or review Assembly Lab lessons for prerequisite gaps, teaching sequence, cognitive load and independent application before drafting prose or changing UI.
---

# Learning design for Assembly Lab

Use when planning a lesson, reviewing a confusing explanation, or deciding whether an
interactive teaches its intended mechanism. This is a local authoring workflow, not a
certification of learning effectiveness. Do not invoke it for unrelated cosmetic fixes.

Read `CLAUDE.md`, `docs/authoring.md` and `docs/style.md` from the repository root.
Their source, model, originality and independent-review rules still apply. Existing user
authorisation governs implementation and publishing; this skill adds no approval gate.

## Produce a brief before choosing controls

1. Inspect the actual lesson, earlier preparation, exercises and current prototype. Record
   what was inspected in a browser and what was read only in source.
2. State one main outcome as an observable action: explain a mechanism, trace an unfamiliar
   case, construct a solution or diagnose an error. “Understand” and “complete the activity”
   are insufficient. Name deferred topics.
3. List the prerequisites and where each is taught or required. Distinguish familiarity
   with a term from having practised the mechanism. Make unsupported assumptions explicit.
4. Map each likely misconception to evidence that would reveal it. Mark predictions about
   learner difficulties as hypotheses unless there is an observed learner response.
5. Choose a small complete worked example and one fresh application. Check all technical
   facts against the named sources and model. If using a miniature, specify its limits and
   the explicit bridge to the real machine. Do not substitute a smaller width silently.
6. Map the route: explanation and worked example, supported action, independent application.
   This is a planning tool, not a required set of headings or separate activity for every fact.
   Exploration may serve the route; it must not be the only way to encounter essential knowledge.
7. Write the evidence of success before selecting the interface. Require an explanation or
   fresh application that distinguishes the intended mechanism from a plausible wrong rule.
   Never equate clicking, correct guessing or reaching the end with understanding.

## Review the proposed experience

- **Essential route:** skip every optional tab, disclosure and preset. Does the visible route
  still define and demonstrate what the independent task requires? A named required action
  may reveal a result, but the page must explain what to do and why, and show what follows.
- **Attention:** identify what the learner must remember, calculate, compare and operate at
  once. Remove controls and displays without a teaching job. Keep the cause near its effect.
- **State:** distinguish changing data, changing its interpretation and executing code.
  Label starting values, current values and independent examples. Avoid accidental state
  changes when moving to a question. Keep prediction state separate from exploration.
- **Representation:** explain each mark, unit, width and sign. Colour supplements words or
  shapes. Repeated views must earn their space through a meaningful comparison.
- **Assessment:** use fresh inputs; ask for the reasoning needed to rule out the misconception.
  Check for answer leakage across the whole page. A fact already taught is not a spoiler;
  the worked solution to the same assessment is. Permit calculators when arithmetic speed
  is not the outcome. Provide specific feedback after submission.
- **Access:** inspect keyboard operation and phone/desktop, light/dark rendering for a built
  prototype. Check focus, labels, target sizes, reflow and state announcements. Record missing
  assistive-technology checks rather than claiming complete accessibility.

## Separate review from evidence of learning

Obtain independent learner and technical reviews under `docs/authoring.md`. Reviewers must
give locations, evidence, severity and a correction direction. Challenge findings and record
accepted and rejected items. Agent role-play can expose problems; it is not a novice study.

For formative testing, invite a person who meets the prerequisites and is new to the topic.
Let them use the lesson without coaching, then try a fresh example and explain their reasoning.
Record first attempts, help given and responses after help separately. A small session finds
problems; it does not prove broad effectiveness. If no person is available, continue authorised
prototype work with that evidence gap stated, and do not describe the lesson as learner-validated.

Finish with a short decision: what to keep, what to change, what evidence supports it, and
what remains uncertain. Update the brief when evidence changes the teaching sequence. Apply
these criteria to the next prototype before polishing it.
