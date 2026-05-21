# AGENTS.md

This file defines how AI coding agents should work on TrustDoko.

Use this file as the operating contract for Codex, Claude Code, OpenCode, Cursor agents, Droid, or any other coding assistant.

---

## Prime directive

Build TrustDoko as a trustworthy, secure, maintainable, Nepal-focused business review and complaint platform.

Do not optimize only for fast implementation. Optimize for correctness, safety, moderation, data privacy, and long-term maintainability.

---

## Required reading before work

Before starting any task, read these files:

1. `README.md`
2. `ARCHITECTURE.md` (including **Assumptions** and **Main modules**)
3. `TASKS.md` (including **Implementation order**)
4. `PROGRESS.md`
5. `KNOWN-ISSUES.md`
6. Relevant source files

Do not edit blindly.

---

## Agent roles

### 1. Planner agent

Purpose:

- Break product requirements into small tasks.
- Identify dependencies.
- Update `TASKS.md`.
- Avoid vague work items.

Rules:

- Every task must have acceptance criteria.
- Every task must identify affected files.
- Every task must be small enough for one focused implementation pass.
- Do not create tasks that mix backend, frontend, database, and design unless necessary.

---

### 2. Architect agent

Purpose:

- Protect system structure.
- Review database models, API design, auth boundaries, and trust-score logic.
- Update `ARCHITECTURE.md` when design changes.

Rules:

- Prefer simple architecture for MVP.
- Avoid premature microservices.
- Keep domain logic out of UI components.
- Keep trust score logic isolated in `lib/trust-score`.
- Keep moderation logic isolated in `lib/moderation`.
- Document important decisions.

---

### 3. Implementation agent

Purpose:

- Implement approved tasks.
- Write clean, typed, testable code.
- Update progress after work.

Rules:

- Make the smallest complete change.
- Do not rewrite unrelated code.
- Do not add dependencies without justification.
- Do not leave dead code.
- Do not hardcode secrets.
- Do not skip validation.
- Do not bypass auth checks.
- Add loading, empty, and error states for UI.
- Use server-side authorization for protected operations.

---

### 4. Review agent

Purpose:

- Inspect code for bugs, gaps, security risks, missing tests, UX issues, and architecture drift.

Review checklist:

- Does this match the product requirement?
- Are permissions enforced on the server?
- Are inputs validated?
- Are database queries safe and efficient?
- Are proof uploads private by default?
- Does the UI handle loading, errors, and empty states?
- Are there tests for important logic?
- Was `PROGRESS.md` updated?
- Were known issues documented?

---

### 5. QA agent

Purpose:

- Test user flows manually and with automated tests.
- Find regressions.
- Update `KNOWN-ISSUES.md`.

Required flows to test:

- Sign up
- Login
- Search businesses
- View business profile
- Submit review
- Submit complaint
- Claim business
- Business replies to review
- Admin moderates review
- Admin verifies business claim

---

### 6. Security agent

Purpose:

- Review authentication, authorization, file uploads, abuse prevention, and private data handling.

High-risk areas:

- Review manipulation
- Fake complaints
- Business impersonation
- Proof file exposure
- Admin dashboard access
- SQL injection or unsafe query construction
- Rate limit bypass
- Public exposure of personal information

---

## Task contract format

Every coding task should follow this format:

```md
## Task: <short name>

### Goal
<What outcome should this task achieve?>

### Context
<Relevant product or architecture context.>

### Files to inspect first
- path/file.ts
- path/file.tsx

### Files likely to change
- path/file.ts
- path/file.tsx

### Requirements
- Requirement 1
- Requirement 2
- Requirement 3

### Acceptance criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

### Constraints
- Do not change unrelated files.
- Do not add new dependencies unless necessary.
- Keep logic typed and tested.

### Validation commands
```bash
pnpm lint
pnpm typecheck
pnpm test
```

### Progress update required
Update `PROGRESS.md` after completion.
```

---

## Coding standards

Use TypeScript strictly.

Expected standards:

- Use clear names.
- Prefer small functions.
- Prefer explicit return types for domain functions.
- Validate external inputs.
- Keep business logic outside React components.
- Use database transactions when multiple related writes must succeed together.
- Use enums for fixed status values.
- Keep status names consistent across database, API, and UI.

---

## UI standards

TrustDoko should feel trustworthy, simple, and local.

Design principles:

- Mobile-first
- Clear hierarchy
- Fast search
- Strong empty states
- Clear trust labels
- Avoid dark patterns
- Avoid hiding negative reviews unfairly
- Show moderation status clearly

Important UI states:

- Loading
- Empty
- Error
- Pending moderation
- Verified
- Unverified
- Under review
- Resolved
- Unresolved

---

## Data privacy rules

Never expose private proof uploads publicly by default.

Private by default:

- Uploaded receipts
- Screenshots with phone numbers
- Chat screenshots
- Order IDs
- Identity documents
- Business registration documents
- PAN/VAT documents
- Admin notes

Public by default:

- Approved review text
- Review rating
- Business public response
- Business public contact details
- Public verification badge
- Public complaint status, if moderated and approved

---

## Moderation rules

Serious claims need special handling.

Terms that should trigger moderation:

- scam
- fraud
- fake product
- not delivered
- stole money
- harassment
- abuse
- fake business
- impersonation

The app should avoid instantly publishing legally risky claims without review.

Use safer public statuses:

- Under Review
- Unresolved Complaint
- Multiple Recent Complaints
- High Risk

Do not automatically publish accusations as facts.

---

## Authorization rules

Minimum rules:

- A user can edit only their own reviews.
- A user can view their own complaint details.
- A business owner can manage only claimed and approved businesses.
- A business owner cannot delete reviews.
- A business owner can respond to reviews and complaints.
- Admins can moderate all platform content.
- Admin actions must be logged.

---

## Database migration rules

- Every schema change needs a migration.
- Do not edit applied migrations casually.
- Add indexes for search-heavy fields.
- Use foreign keys for ownership and relationships.
- Use soft delete where audit history matters.
- Do not destroy review or complaint history unless legally required.

---

## Testing rules

Prioritize tests for:

- Trust score calculation
- Review status transitions
- Complaint status transitions
- Business claim approval
- Authorization checks
- Input validation
- Search filters

Minimum validation before marking task done:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

If commands fail because the project has no script yet, document it in `KNOWN-ISSUES.md`.

---

## Dependency rules

Before adding a package, answer:

1. Is it necessary?
2. Is it maintained?
3. Does it increase security risk?
4. Can this be done with existing stack?
5. Does it work with the current framework version?

Add the reason in `PROGRESS.md` if a dependency is added.

---

## Git commit style

Use clear commits:

```txt
feat: add business profile page
feat: add review submission flow
fix: prevent business owner from editing reviews
refactor: isolate trust score calculation
test: add complaint status tests
docs: update architecture for moderation flow
```

---

## Agent handoff format

At the end of a work session, update `PROGRESS.md` using this format:

```md
## YYYY-MM-DD - <agent/tool name>

### Completed
- Item 1
- Item 2

### Changed files
- path/file.ts
- path/file.tsx

### Validation
- `pnpm lint`: pass/fail/not available
- `pnpm typecheck`: pass/fail/not available
- `pnpm test`: pass/fail/not available

### Notes
- Important note

### Next suggested task
- Next task
```

---
## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes. 
## Hard no list

Agents must not:

- Commit secrets
- Disable auth checks to make tests pass
- Expose proof uploads publicly
- Delete negative reviews without moderation logic
- Let businesses edit customer reviews
- Let users create unlimited spam reviews
- Add fake ratings or fake seed reviews presented as real
- Add paid rating boosts
- Rewrite the entire app without a task requiring it
- Ignore failing tests
- Hide unresolved issues
