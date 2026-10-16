# Copyright © 2026 Christopher Snow
"""Two-turn Mistral review of each lesson. Reads the key from MISTRAL_API(_KEY) only."""
import json, os, re, sys, time, datetime, urllib.request, urllib.error

KEY = os.environ.get("MISTRAL_API") or os.environ.get("MISTRAL_API_KEY")
MODEL = "mistral-large-latest"
OUT = "docs/notes/review/mistral"
DATE = datetime.date.today().isoformat()

PREREQS = """The course assumes a little C and a little arithmetic, and no assembly language.
You need to read small C functions, not write whole programs. That means:
- A function with `int` and `unsigned` arguments, and a `return`.
- `if` and `else`.
- `for` and `while` loops.
- An array indexed with `a[i]`.
Pointers, structs, `malloc` and the standard library are not assumed. Module 7 teaches pointers, as addresses. You do not need a compiler. Everything runs in your browser.
You need to convert binary to decimal and back. Hexadecimal and the signed reading of a number are taught in Module 1, so you do not need them first.
You need no assembly language, because Module 0 starts from nothing."""
SYSTEM = ("You are reviewing one lesson of an interactive web course that teaches 64-bit Arm assembly alongside C. "
          "The learner knows only this, from the course's front page, plus the lessons before this one:\n\n" + PREREQS +
          "\n\nLines in italics are captions of interactive figures that the page shows; "
          "'Shown after the answer is checked' marks text revealed after a prediction.")
Q1 = "Review. Is the content clear and easy to follow?"
Q2 = "Some of the text seems more complex than it should be"

def chat(msgs):
    body = json.dumps({"model": MODEL, "temperature": 0.3, "messages": msgs}).encode()
    for attempt in range(4):
        req = urllib.request.Request("https://api.mistral.ai/v1/chat/completions", body,
            {"Authorization": "Bearer " + KEY, "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                return json.load(r)["choices"][0]["message"]["content"]
        except (urllib.error.URLError, TimeoutError) as e:
            code = getattr(e, "code", "net")
            print("retry", attempt, code, file=sys.stderr)
            if attempt == 3 or code in (400, 401, 403): raise
            time.sleep(2 ** (attempt + 1))

def lessons():
    for m in range(5):
        text = open(f"docs/notes/module-{m}/prose.md").read()
        if m == 0:  # one lesson, no "# Lesson" line: take from its first section
            text = "# Lesson 1: Module 0\n\n" + text[text.index("## 0. Objectives"):]
        parts = re.split(r"(?m)^(?=# Lesson )", text)[1:]
        for k, p in enumerate(parts, 1):
            yield m, k, p.strip()

ONLY = os.environ.get("ONLY_MODULE")
for m, k, p in lessons():
    if ONLY is not None and str(m) != ONLY: continue
    title = p.splitlines()[0].lstrip("# ").strip()
    n = m
    path = f"{OUT}/module-{n}-lesson-{k}.md"
    try:
        msgs = [{"role": "system", "content": SYSTEM}, {"role": "user", "content": p + "\n\n" + Q1}]
        r1 = chat(msgs)
        msgs += [{"role": "assistant", "content": r1}, {"role": "user", "content": Q2}]
        r2 = chat(msgs)
    except Exception as e:
        print("FAILED", m, k, e, file=sys.stderr); continue
    with open(path, "w") as f:
        f.write(f"# {title}\n\nModel: {MODEL} (temperature 0.3). Date: {DATE}. Source: module {m}, {title.split(':')[0]}.\n\n## Reply 1\n\n{r1}\n\n## Reply 2\n\n{r2}\n")
    print("ok", path)
