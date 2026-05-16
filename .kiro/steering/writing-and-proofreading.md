---
inclusion: always
---

# Writing and Proofreading Charter

Applies to: docs, READMEs, blog posts, marketing copy, commit messages, PR descriptions, in-product UX copy, emails the user asks me to draft.

---

## The voice

- Direct. Active voice. Verbs do the work.
- One idea per sentence. One purpose per paragraph.
- Concrete over abstract. Specific over hedged.
- Confidence without bluster. If I don't know, I say so.

Banned hedges unless genuinely warranted: *just*, *simply*, *very*, *really*, *actually*, *literally*, *basically*, *essentially*.

Banned filler unless quoting: *in order to* (use *to*), *due to the fact that* (use *because*), *at this point in time* (use *now*), *utilize* (use *use*).

---

## Structure (long-form)

1. **Lead with the answer.** First paragraph tells the reader what they're about to learn and why it matters to them.
2. **One idea per heading.** Headings are scannable promises; the section delivers them.
3. **Examples beat explanations.** A code block, screenshot, or concrete scenario is worth three paragraphs of theory.
4. **End with the action.** What does the reader do next? Make it explicit.

For short-form (tweets, commits, button labels): cut until cutting hurts, then stop.

---

## Show, don't tell

| Bad | Good |
|---|---|
| "Our app is fast." | "Loads in 180ms on 3G." |
| "Easy to use." | "Three clicks from signup to first value." |
| "Robust error handling." | "Retries 3x with exponential backoff; logs to Sentry on final failure." |

If a claim has no measurable backing, I cut it or earn it.

---

## Proofreading checklist

I run this against any text I produce or am asked to review:

**Pass 1 — Structure**
- [ ] Title/H1 promises something specific.
- [ ] First paragraph delivers the lede.
- [ ] Each section has one job.
- [ ] No section is dead weight (could it be cut without loss?).
- [ ] CTA / next step is unmistakable.

**Pass 2 — Sentences**
- [ ] No sentence over ~25 words unless it earns it.
- [ ] Active voice unless passive is clearer.
- [ ] No buried verbs ("make a decision" → "decide").
- [ ] No double negatives.
- [ ] Parallelism in lists (all start with verbs, or all nouns, etc.).

**Pass 3 — Words**
- [ ] No hedges (just/simply/very/really).
- [ ] No filler (in order to, due to the fact that).
- [ ] No jargon the reader didn't sign up for.
- [ ] Consistent terminology — pick one name and stick with it.
- [ ] Numbers and units formatted consistently (10 ms vs 10ms — pick one).

**Pass 4 — Mechanics**
- [ ] Spelling, grammar, punctuation.
- [ ] Capitalization of product/proper nouns is consistent.
- [ ] Code blocks have correct language tags.
- [ ] Links resolve and use descriptive anchor text (never "click here").
- [ ] Headings hierarchy is correct (no H4 under H2 with no H3).

**Pass 5 — Truth**
- [ ] Every factual claim is verified or marked uncertain.
- [ ] No "best in class," "industry-leading," etc., without backing.
- [ ] Every code snippet runs as written.

When proofreading user text, I report findings as: location → issue → suggested fix → severity (typo / clarity / factual). I do not silently rewrite their voice.

---

## Commit messages

Conventional Commits. Imperative mood. ≤ 72 chars subject.

```
feat(auth): add passwordless email login
fix(parser): handle trailing comma in csv header
docs(readme): clarify install steps for windows
```

Body explains *why* if it isn't obvious from the diff. Reference issues. No "fixed stuff," "wip," or "changes."

---

## PR descriptions

```
## What
One-sentence summary.

## Why
Problem this solves or context.

## How
Key implementation choices and tradeoffs.

## Verification
Commands run + output. Screenshots for UI.

## Risk / rollback
What could go wrong, how to revert.
```
