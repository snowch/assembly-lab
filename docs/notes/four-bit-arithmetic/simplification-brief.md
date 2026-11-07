# Simplifying the carry explanation

Copyright © 2026 Christopher Snow.

## Authorised scope and observable outcome

The user approved removing the closing 32-bit register/ALU activity from this page and keeping the existing 3 + 3 walkthrough. The relevant gap is adding two operand bits of 1 together with an incoming carry of 1. A reader should explain that binary 11 supplies two different outputs: one bit stays in this column and the carry goes one column left. Its place there has twice the weight. The incoming carry remains a third input; it does not replace an operand.

Keep the distinct four-place boundary, invert/add-one subtraction method and existing fresh 6 − 3 exercise. Keep hardware and gate explanations in Bit Lab. Add no new lesson, assessment, display mode or step control. The existing Next column route should explicitly encounter the three-one case at bit 1. Restore the short bridge from four-bit subtraction to the next 32-bit lesson.

## Preparation and checked facts

Module 0 already teaches registers, ADD inputs/destination, constants, subtraction and instruction order. Earlier Module 1 lessons teach positional weights and two's complement. The current lesson defines carry before its first figure. `fourBitAddition` takes actual machine addition columns and retains four positions for the miniature. It computes 3 + 3 as 0110: bit 0 receives 1,1,0 and emits kept 0/carry 1; bit 1 receives 1,1,1 and emits kept 1/carry 1. `fourBitSubtraction(6,3)` supplies the separate existing exercise. A full-column explanation must continue to distinguish revealing a calculation from executing an Arm instruction.

The current figure already labels A, B and Carry in, then displays separate Carry/Kept outputs. Its complete measured connector carries the outgoing bit into the next column. Reuse this view; introduce no other architecture drawing. Clarify outputs locally only if wording or a small label change improves their roles without crowding phones.

## Learning and UX workflow

Applied `.agents/skills/learning-design/SKILL.md`, with repository authoring/style/visual-language instructions. No separate UX skill is installed after local/catalog discovery; apply attention, state, representation and access criteria and obtain an independent built-page UX review. This is expert review, not novice learning evidence.

User feedback is evidence that the extra activity distracts from the required mechanism. An incoming carry replacing an operand, a carry of 2, or a carry with the same weight as the kept bit are hypotheses to check against the displayed worked route. The existing subtraction exercise practises the broader method; no additional diagnostic quiz is authorised by this minimal simplification. Do not claim demonstration or completion establishes transfer.

The implementation removes the unused activity registration, widget, helper, stylesheet and activity-only tests after checking references. Retain useful native differential boundary coverage and historical review notes. Synchronise canonical prose. Independent learner/UX and technical reviews must inspect actual final built phone/desktop light/dark states, keyboard stepping/reset and the existing graded exercise.

## Cross-course reference

Bit Lab's ALU explanation currently promises the removed 32-bit view at this URL. Correct that one paragraph and its canonical record to point to the existing Assembly Module 0, lesson 1, One addition, which actually introduces ADD register inputs/destination. Preserve all Bit Lab gate/ALU activities and questions. This is required link upkeep, not a redesign of that course.
