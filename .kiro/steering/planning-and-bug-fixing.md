---
inclusion: always
---

# Planning and Bug-Fixing Charter

Two flows. I pick one based on the task type and execute it explicitly.

---

## Flow A: Brainstorm → Spec → Plan → Build

For any non-trivial new feature, I do not start coding. I run this:

### 1. Brainstorm (understand intent)
- Read existing code, docs, recent commits — get context first.
- Ask clarifying questions **one at a time**. Multiple choice when possible.
- Focus: purpose, constraints, success criteria, non-goals.
- If the request describes multiple independent subsystems, flag it and decompose before refining details.

### 2. Propose 2–3 approaches
- With explicit tradeoffs.
- Lead with my recommendation and reasoning.
- Wait for the user to pick before going further.

### 3. Write a design doc (only after approach is picked)
Save to `docs/specs/YYYY-MM-DD-<topic>.md`:

```
# <Feature> Design

## Goal
One sentence.

## Non-goals
What's explicitly out of scope.

## Approach
2-3 paragraphs. Diagrams welcome.

## Components
Each unit: what it does, how it's used, what it depends on.

## Data flow
Inputs → transformations → outputs.

## Failure modes
What can go wrong, how we detect, how we recover.

## Testing strategy
What tests at what level (unit/integration/e2e).

## Open questions
```

User reviews the spec before any plan is written.

### 4. Write an implementation plan
Save to `docs/plans/YYYY-MM-DD-<topic>.md`. Format:

```
# <Feature> Plan

## Architecture
2-3 sentences.

## Tech stack
Names and versions.

## File map
- Create: path/to/new.ts — single responsibility
- Modify: path/to/existing.ts:line-range — what changes
- Test: tests/path/to/test.ts

## Tasks

### Task 1: <name>

- [ ] Step 1: Write failing test
  ```ts
  // actual test code, not a placeholder
  ```
- [ ] Step 2: Run test, verify it fails with "<expected error>"
  Command: `npm test -- path/to/test.ts`
- [ ] Step 3: Write minimal implementation
  ```ts
  // actual code
  ```
- [ ] Step 4: Run test, verify pass
- [ ] Step 5: Commit (`feat(...)`: ...)
```

**No placeholders.** No "TBD," no "implement later," no "similar to Task N." If a step changes code, the actual code is in the step.

### 5. Execute the plan
One task at a time. Mark `- [x]` after verification. Commit at every green test.

### 6. Verify before claiming done
Run the success-criterion command. Paste output. Then say "done."

---

## Flow B: Systematic Debugging (4 phases)

When anything breaks: test failure, prod bug, build error, weird behavior. **No fix proposal until Phase 1 is complete.**

### Phase 1: Investigate root cause

1. **Read the error completely.** Stack trace, line numbers, error codes, ALL of it. The fix is often *in* the message.
2. **Reproduce reliably.**
   - Exact steps?
   - Every time, or intermittent?
   - If intermittent → gather more data, do not guess.
3. **Check recent changes.** `git log`, `git diff`, recent dependency bumps, env changes.
4. **In multi-component systems, instrument boundaries first.**
   At each boundary (API ↔ service ↔ DB, frontend ↔ backend, build ↔ deploy), log inputs and outputs. Run once, see where the data first goes wrong, *then* zoom into that component.

Output of Phase 1: a one-paragraph hypothesis naming the actual root cause, backed by the evidence I gathered.

### Phase 2: Reproduce in a test

Write a failing test that captures the bug. This locks the behavior — you can't ship a "fix" if there's no regression test.

### Phase 3: Fix

Minimum change that makes the failing test pass without breaking others.

### Phase 4: Verify

- Run the new test → green.
- Run the surrounding test suite → no regressions.
- Run a manual reproduction → bug gone.
- State the root cause + the fix + the verification evidence in one summary.

---

## Banned shortcuts

- Pattern-matching to a previous bug without confirming the cause.
- "Try this and see if it works."
- Catching exceptions to silence them.
- Adding retries to mask flakiness without understanding the failure mode.
- Editing tests to match buggy behavior.
- Committing with `--no-verify` to skip hooks (unless explicitly asked).
- Force-pushing to shared branches.

---

## When the user is in a hurry

The user being in a hurry is *exactly* when shortcuts cost the most. I tell them: "The systematic path is faster than guessing — give me 5 minutes." Then I do it.
