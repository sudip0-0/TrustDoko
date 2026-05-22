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
- [x] Shows business name, category, city, rating, trust score, trust label, verification badge
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
- [x] Search works by category name and social/website URLs
- [x] Category filter works
- [x] City filter works
- [x] Sort by trust, rating, reviews, or newest
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

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] Authenticated user can submit review
- [x] Rating is required and must be 1 to 5
- [x] Review title/body validated
- [x] Experience type can be selected
- [x] Review starts with correct status
- [x] Business aggregate rating updates after approval

---

### TD-0302: Add review moderation status logic

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] Safe reviews can be approved or pending based on policy
- [x] Risky keywords move review to `PENDING` (MVP moderation)
- [x] Rate limit blocks rapid repeat submissions
- [x] Status logic is in `lib/moderation`
- [x] Unit tests cover status decisions

---

### TD-0303: Display reviews on business profile

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] Only approved public reviews are shown
- [x] Review status is shown to review author when pending
- [x] Reviews are paginated
- [x] Reviews sorted by recency for MVP
- [ ] Business responses displayed if available (deferred — no owner replies yet)

---

### TD-0304: Add helpful votes

Status: DONE  
Priority: P2

Acceptance criteria:

- [x] User can mark review helpful
- [x] User cannot vote multiple times on same review
- [x] Helpful count updates

---

## Milestone 4: Complaints and reports

### TD-0401: Create complaint submission flow

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] Authenticated user can submit complaint
- [x] Complaint category is required
- [x] Description is required
- [x] Proof upload is optional
- [x] Complaint starts with `SUBMITTED` or `UNDER_REVIEW`
- [x] Complaint is visible to submitter in dashboard

---

### TD-0402: Add complaint status workflow

Status: DONE  
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

- [x] Status transitions are controlled
- [x] Admin can change status
- [x] Business can respond but not arbitrarily resolve alone
- [x] Status changes are logged

---

### TD-0403: Show complaint summary on business profile

Status: DONE  
Priority: P1

Acceptance criteria:

- [x] Shows number of public/moderated complaints
- [x] Shows unresolved complaint count
- [x] Does not expose private proof
- [x] Does not expose admin notes
- [x] Uses careful wording

---

## Milestone 5: Trust score

### TD-0501: Implement trust score module

Status: DONE  
Priority: P0

Location:

```txt
lib/trust-score
```

Acceptance criteria:

- [x] Deterministic calculation function exists
- [x] Returns score from 0 to 100
- [x] Returns trust label
- [x] Returns reason list
- [x] Unit tests cover normal and edge cases

---

### TD-0502: Recalculate trust score after review/complaint changes

Status: DONE  
Priority: P1

Acceptance criteria:

- [x] Score updates after approved review
- [x] Score updates after complaint status change
- [x] Score updates after verification status change
- [x] Logic avoids expensive full-table recalculation on every request

---

### TD-0503: Add trust score explanation UI

Status: DONE  
Priority: P1

Acceptance criteria:

- [x] Business profile shows why score exists
- [x] Trust score page explains labels
- [x] Wording avoids legal overclaiming

---

## Milestone 6: Business ownership

### TD-0601: Add business claim request flow

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] User can request to claim business
- [x] User selects verification method
- [x] User submits required proof
- [x] Claim status becomes pending
- [x] Admin can review claim

---

### TD-0602: Add business dashboard

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] Owner can view claimed businesses
- [x] Owner can edit allowed business fields
- [x] Owner can view reviews
- [x] Owner can reply to reviews
- [x] Owner can view complaints for own business
- [x] Owner can respond to complaints

---

### TD-0603: Add verification badges

Status: DONE  
Priority: P1

Acceptance criteria:

- [x] Verification status visible on business profile
- [x] Contact verified badge works
- [x] Document verified badge works
- [x] Social verified badge works
- [x] Badge meaning is explained

---

## Milestone 7: Admin moderation

### TD-0701: Create admin dashboard shell

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] Admin-only route exists
- [x] Non-admin users blocked server-side
- [x] Dashboard navigation exists
- [x] Basic metrics shown

---

### TD-0702: Add review moderation queue

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] Admin can view pending/flagged reviews
- [x] Admin can approve review
- [x] Admin can reject review
- [x] Admin can mark review under review
- [x] Audit log records action

---

### TD-0703: Add complaint moderation queue

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] Admin can view complaints
- [x] Admin can update complaint status
- [x] Admin can add private note
- [ ] Admin can view proof files securely
- [x] Audit log records action

---

### TD-0704: Add business claim moderation queue

Status: DONE  
Priority: P0

Acceptance criteria:

- [x] Admin can view pending claims
- [x] Admin can approve claim
- [x] Admin can reject claim
- [x] Business ownership updates on approval
- [x] Audit log records action

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
