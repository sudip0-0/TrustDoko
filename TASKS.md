# TASKS.md

This file tracks implementation tasks for TrustDoko.

Agents must update task status when work starts or finishes.

Status values:

```txt
TODO
IN_PROGRESS
BLOCKED
DONE
DEFERRED
```

Priority values:

```txt
P0 Critical
P1 Important
P2 Useful
P3 Later
```

---

## Implementation order

Execute milestones in this order. Do not skip foundation work.

```txt
Milestone 0  →  Project setup (TD-0001, TD-0003; TD-0002 done)
Milestone 1  →  Database + auth (TD-0101–TD-0104)
Milestone 2  →  Public discovery (TD-0201–TD-0204)
Milestone 3  →  Reviews (TD-0301–TD-0303; trust score TD-0501–TD-0502)
Milestone 4  →  Complaints (TD-0401–TD-0403)
Milestone 5  →  Trust score UI (TD-0503) — can overlap with Milestone 6
Milestone 6  →  Business ownership (TD-0601–TD-0603)
Milestone 7  →  Admin moderation (TD-0701–TD-0704)
Milestone 8  →  File upload (TD-0801–TD-0802) — proof optional until this milestone
Milestone 9  →  Quality + launch (TD-0901–TD-0904)
```

Post-MVP (do not block launch): TD-0304 (helpful votes), TD-1001+ backlog.

See `PROGRESS.md` for phased exit criteria and `ARCHITECTURE.md` for module boundaries.

---

## Milestone 0: Project setup

### TD-0001: Initialize project

Status: DONE  
Priority: P0

Goal:
Create the base application using the selected stack.

Recommended stack:

```txt
Next.js + TypeScript + Tailwind CSS + PostgreSQL + Prisma + Auth.js
```

Acceptance criteria:

- [x] Next.js project created
- [x] TypeScript enabled
- [x] Tailwind configured
- [x] Basic app layout exists
- [x] `.env.example` added
- [x] README setup instructions verified

Validation:

```bash
pnpm dev
pnpm lint
pnpm typecheck
```

---

### TD-0002: Add project documentation files

Status: DONE  
Priority: P0

Goal:
Add agent-friendly project documentation.

Acceptance criteria:

- [x] `README.md` exists
- [x] `AGENTS.md` exists
- [x] `ARCHITECTURE.md` exists
- [x] `TASKS.md` exists
- [x] `PROGRESS.md` exists
- [x] `KNOWN-ISSUES.md` exists

---

### TD-0003: Configure linting, formatting, and typecheck

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] Lint command exists
- [x] Typecheck command exists
- [x] Format command exists
- [x] Project passes initial validation

Suggested scripts:

```json
{
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write ."
}
```

---

## Milestone 1: Database and auth foundation

### TD-0101: Add Prisma and database connection

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] Prisma installed
- [x] PostgreSQL connection configured (Docker Compose, port 5433)
- [x] Prisma client generated
- [x] Initial migration works
- [x] Database helper created (`lib/db/`, `checkDatabaseConnection`)

Files likely to change:

- `prisma/schema.prisma`
- `lib/db/prisma.ts`
- `.env.example`

---

### TD-0102: Create core database schema

Status: DONE  
Priority: P0

Models to add:

- User
- Business
- Category
- Review
- Complaint
- BusinessClaim
- VerificationRequest
- FileAsset
- AuditLog

Acceptance criteria:

- [x] Models created
- [x] Relations created
- [x] Enums created
- [x] Indexes added for core queries
- [x] Migration generated (`20260521150137_init`)

---

### TD-0103: Add authentication

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] User can register
- [x] User can login
- [x] User can logout
- [x] Session is available server-side (`auth()`, `getSessionUser()`)
- [x] Protected routes redirect unauthenticated users (`/dashboard/*`)
- [x] User role is available safely on the server (JWT session)

---

### TD-0104: Add permission helpers

Status: DONE  
Priority: P0

Goal:
Centralize authorization logic.

Acceptance criteria:

- [x] `lib/permissions` exists
- [x] Helper for admin check exists
- [x] Helper for business ownership check exists
- [x] Helper for review ownership check exists
- [x] Unit tests added (Vitest, 28 tests)

---

## Milestone 2: Public business discovery

### TD-0201: Add category seed data

Status: DONE  
Priority: P1

Initial categories:

- Online Clothing
- Electronics and Mobile
- Beauty and Cosmetics
- Travel and Tours
- Food and Cloud Kitchen
- Repair Services
- Education Consultancy
- Home Services
- Health and Dental
- Event Vendors

Acceptance criteria:

- [x] Seed script exists
- [x] Categories inserted
- [x] Seed is repeatable
- [x] Sample businesses seeded (`[Sample]` prefix in `prisma/seed.ts`)

---

### TD-0202: Create business listing page

Status: DONE  
Priority: P0

Route:

```txt
/businesses
```

Acceptance criteria:

- [x] Shows business list
- [x] Supports pagination
- [x] Shows business name, category, city, rating, trust label
- [x] Empty state exists
- [x] Loading state exists
- [x] Mobile layout works

---

### TD-0203: Add search and filters

Status: DONE  
Priority: P0

Filters:

- Keyword
- Category
- City
- Business type
- Verification status
- Minimum rating
- Trust label

Acceptance criteria:

- [x] Search works by business name
- [x] Category filter works
- [x] City filter works
- [x] URL query params preserve state
- [x] Pagination works with filters

---

### TD-0204: Create business profile page

Status: DONE  
Priority: P0

Route:

```txt
/businesses/[slug]
```

Acceptance criteria:

- [x] Shows public business info
- [x] Shows rating summary
- [x] Shows trust score label
- [x] Shows review list
- [x] Shows complaint summary
- [x] Shows verification status
- [x] Shows CTA to write review
- [x] Shows CTA to report issue
- [x] Shows CTA to claim business if unclaimed

---

## Milestone 3: Reviews

### TD-0301: Create review submission flow

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] Authenticated user can submit review
- [ ] Rating is required and must be 1 to 5
- [ ] Review title/body validated
- [ ] Experience type can be selected
- [ ] Review starts with correct status
- [ ] Business aggregate rating updates after approval

---

### TD-0302: Add review moderation status logic

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] Safe reviews can be approved or pending based on policy
- [ ] Risky keywords move review to `UNDER_REVIEW`
- [ ] Suspicious behavior can flag review
- [ ] Status logic is in `lib/moderation`
- [ ] Unit tests cover status decisions

---

### TD-0303: Display reviews on business profile

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] Only approved public reviews are shown
- [ ] Review status is shown to review author when pending
- [ ] Reviews are paginated
- [ ] Reviews sorted by recency for MVP (helpful ranking deferred to TD-0304)
- [ ] Business responses displayed if available

---

### TD-0304: Add helpful votes

Status: TODO  
Priority: P2

Acceptance criteria:

- [ ] User can mark review helpful
- [ ] User cannot vote multiple times on same review
- [ ] Helpful count updates

---

## Milestone 4: Complaints and reports

### TD-0401: Create complaint submission flow

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] Authenticated user can submit complaint
- [ ] Complaint category is required
- [ ] Description is required
- [ ] Proof upload is optional
- [ ] Complaint starts with `SUBMITTED` or `UNDER_REVIEW`
- [ ] Complaint is visible to submitter in dashboard

---

### TD-0402: Add complaint status workflow

Status: TODO  
Priority: P0

Statuses:

```txt
SUBMITTED
UNDER_REVIEW
BUSINESS_RESPONDED
RESOLVED
UNRESOLVED
REJECTED
```

Acceptance criteria:

- [ ] Status transitions are controlled
- [ ] Admin can change status
- [ ] Business can respond but not arbitrarily resolve alone
- [ ] Status changes are logged

---

### TD-0403: Show complaint summary on business profile

Status: TODO  
Priority: P1

Acceptance criteria:

- [ ] Shows number of public/moderated complaints
- [ ] Shows unresolved complaint count
- [ ] Does not expose private proof
- [ ] Does not expose admin notes
- [ ] Uses careful wording

---

## Milestone 5: Trust score

### TD-0501: Implement trust score module

Status: TODO  
Priority: P0

Location:

```txt
lib/trust-score
```

Acceptance criteria:

- [ ] Deterministic calculation function exists
- [ ] Returns score from 0 to 100
- [ ] Returns trust label
- [ ] Returns reason list
- [ ] Unit tests cover normal and edge cases

---

### TD-0502: Recalculate trust score after review/complaint changes

Status: TODO  
Priority: P1

Acceptance criteria:

- [ ] Score updates after approved review
- [ ] Score updates after complaint status change
- [ ] Score updates after verification status change
- [ ] Logic avoids expensive full-table recalculation on every request

---

### TD-0503: Add trust score explanation UI

Status: TODO  
Priority: P1

Acceptance criteria:

- [ ] Business profile shows why score exists
- [ ] Trust score page explains labels
- [ ] Wording avoids legal overclaiming

---

## Milestone 6: Business ownership

### TD-0601: Add business claim request flow

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] User can request to claim business
- [ ] User selects verification method
- [ ] User submits required proof
- [ ] Claim status becomes pending
- [ ] Admin can review claim

---

### TD-0602: Add business dashboard

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] Owner can view claimed businesses
- [ ] Owner can edit allowed business fields
- [ ] Owner can view reviews
- [ ] Owner can reply to reviews
- [ ] Owner can view complaints for own business
- [ ] Owner can respond to complaints

---

### TD-0603: Add verification badges

Status: TODO  
Priority: P1

Acceptance criteria:

- [ ] Verification status visible on business profile
- [ ] Contact verified badge works
- [ ] Document verified badge works
- [ ] Social verified badge works
- [ ] Badge meaning is explained

---

## Milestone 7: Admin moderation

### TD-0701: Create admin dashboard shell

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] Admin-only route exists
- [ ] Non-admin users blocked server-side
- [ ] Dashboard navigation exists
- [ ] Basic metrics shown

---

### TD-0702: Add review moderation queue

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] Admin can view pending/flagged reviews
- [ ] Admin can approve review
- [ ] Admin can reject review
- [ ] Admin can mark review under review
- [ ] Audit log records action

---

### TD-0703: Add complaint moderation queue

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] Admin can view complaints
- [ ] Admin can update complaint status
- [ ] Admin can add private note
- [ ] Admin can view proof files securely
- [ ] Audit log records action

---

### TD-0704: Add business claim moderation queue

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] Admin can view pending claims
- [ ] Admin can approve claim
- [ ] Admin can reject claim
- [ ] Business ownership updates on approval
- [ ] Audit log records action

---

## Milestone 8: File upload

### TD-0801: Add file upload service

Status: TODO  
Priority: P1

Acceptance criteria:

- [ ] Upload service exists
- [ ] MIME type validation exists
- [ ] File size limit exists
- [ ] Private/public visibility stored
- [ ] Proof uploads default to private

---

### TD-0802: Attach proof to review and complaint

Status: TODO  
Priority: P1

Acceptance criteria:

- [ ] User can upload proof during review if enabled
- [ ] User can upload proof during complaint
- [ ] Proof is not publicly displayed
- [ ] Admin can access proof

---

## Milestone 9: Quality and launch readiness

### TD-0901: Add automated tests for domain logic

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] Trust score tests exist
- [ ] Moderation tests exist
- [ ] Permission tests exist
- [ ] Complaint workflow tests exist

---

### TD-0902: Add seed data for local testing

Status: TODO  
Priority: P1

Acceptance criteria:

- [ ] Test users created
- [ ] Test businesses created
- [ ] Test reviews created
- [ ] Test complaints created
- [ ] Seed data is clearly fake

---

### TD-0903: Add basic SEO metadata

Status: TODO  
Priority: P1

Acceptance criteria:

- [ ] Home page metadata exists
- [ ] Business profile metadata exists
- [ ] Category metadata exists
- [ ] Open Graph basics exist

---

### TD-0904: Security review pass

Status: TODO  
Priority: P0

Acceptance criteria:

- [ ] Auth boundaries reviewed
- [ ] Admin routes protected
- [ ] Business ownership checks reviewed
- [ ] Proof file exposure reviewed
- [ ] Rate limiting planned or implemented
- [ ] Known risks documented

---

## Backlog: future features

### TD-1001: Public TrustDoko badge widget

Status: DEFERRED  
Priority: P3

A business can embed a TrustDoko badge on its website.

---

### TD-1002: Browser extension for social sellers

Status: DEFERRED  
Priority: P3

A browser extension can detect Facebook/Instagram shop links and show TrustDoko status.

---

### TD-1003: SMS/WhatsApp-style complaint notification

Status: DEFERRED  
Priority: P3

Notify business owners when complaints are submitted.

---

### TD-1004: Advanced fraud detection

Status: DEFERRED  
Priority: P3

Detect fake reviews using account patterns, device signals, IP clustering, and review similarity.

---

### TD-1005: Mobile app

Status: DEFERRED  
Priority: P3

React Native mobile app after web MVP validates demand.
