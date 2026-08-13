# Contributing

Contributions are welcome — in **English or Indonesian**, whichever you are
more comfortable writing.

## The one rule that matters

**Every finding must be checkable, and every deviation must have a written
reason.**

This repository's whole value is that you do not have to take anyone's word
for anything. If you claim the original program does something, point at the
line. If you change how a port behaves, say why.

For any change to a port, the document in `web/docs/` uses a fixed four-column
form. Keep it:

| original form | the constraint that produced it | interpretation | present form and why |
|---|---|---|---|

If you changed something on taste rather than necessity, **say so**. "I found
the original ugly" is an acceptable reason. Pretending it was necessary is not.

## Kinds of contribution, and what each needs

**Fixing a bug in a port.** Say which behaviour is wrong and how you know —
ideally by pointing at the line in `run/*.BAS` that says otherwise. If the
original itself is buggy and the port faithfully reproduces it, that is
*not* a bug; see below.

**Deliberately preserved bugs.** Several ports keep mistakes from 1982 on
purpose, because removing them would hide what the code actually does. They
are labelled on screen and in the document. Please do not "fix" them. If you
think one is mislabelled, open an issue.

**Porting something new.** The 66 programs that count are done. Anything else
you build belongs in `EXTRAS` in `web/_shared/catalog.js`, not `CATALOG` — the
"66 programs" statistic on the front page is computed from `CATALOG` alone, and
adding to it would make the progress figure lie.

**Building something bigger.** Mobile version, multiplayer, better AI, level
editors — these are the point. Open an issue first so we can agree where it
lives.

**Translations.** The application interfaces stay in the **original English**
as written in 1982; that is part of what is being preserved. Documents and code
comments are in Indonesian. Translations of documents are very welcome.

## Technical constraints — these are not negotiable

Everything must keep running from `file://` by double-clicking, on a machine
with no network:

- **No** ES modules, **no** `fetch()`, **no** CDN, **no** build step
- Data files assign to `window.RETRO.*` and are loaded with plain `<script>`
- Shared code lives in `web/_shared/` — **use it, do not modify it**; 66 pages
  depend on it
- Page skeleton order in the game column: `.screen` → `.ruleset` → `.hud` →
  `.howto`, and `.howto` is always `open` and never in the right-hand column
- Every page calls `RETRO.ui.topbar(...)` and mounts it into `#topbar-host`

## Before you open a pull request

1. Open the page from `file://` **and** from a local server; both must work.
2. Check the browser console — **zero errors**.
3. Resize the window narrow. Nothing may be clipped without a scrollbar.
4. If you touched a port's rules, play a full round and confirm the outcome is
   unchanged from before your edit.
5. If you touched a drawing, check that what is drawn agrees with the numbers
   shown. A picture that disagrees with the scoreboard is worse than no
   picture — this has been the single most common defect in this project.

## Personal data

Some 1982 sources carried their authors' home addresses and phone numbers.
Those are **masked, not deleted**, and the mask is padded to the exact original
character count so box-drawing art still lines up. Please do not restore them,
and if you find one that was missed, say so in an issue rather than in a public
pull request.
