// Module 2, lesson 1 (content/lessons/adding-and-the-flags.listings.ts): the assembly the lesson wrote
// itself, unchanged. `plus` is the addition its figures draw and its challenges ask about;
// `sum_flags` is the failure experiment, an `adds` that leaves all four flags at 0 and then an `add`.
plus:
  adds w0, w0, w1
  ret
sum_flags:
  adds w2, w1, w1
  add w0, w0, w1
  ret
