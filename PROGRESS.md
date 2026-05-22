# PROGRESS.md

This file tracks what has been completed, what changed, validation results, and next steps.

Agents must update this file after every meaningful coding session.

---

## Current project phase

**Milestone 4 (complaints) — complete.**

Complaint submission, status workflow, public summary on profiles, user dashboard list, and owner responses for claimed businesses are live. Next: trust score module (TD-0501) or business claims (TD-0601).

---

## Current status summary

| Area | Status |
|------|--------|
| Product scope | Defined in `README.md` |
| Architecture | Defined in `ARCHITECTURE.md` |
| Task backlog | TD-0001, TD-0002, TD-0003 **DONE** |
| Next.js app | **Initialized** (App Router, landing page) |
| TypeScript | **Strict** (`strict`, `noUncheckedIndexedAccess`) |
| Tailwind CSS | **Configured** (v4, `@theme` tokens) |
| ESLint / Prettier | **Configured** |
| Prisma | **MVP schema v2** (`expand_mvp_schema`) |
| PostgreSQL | **Docker** (`trustdoko-postgres`, port **5433**) |
| Seed data | **10 categories + 12 sample businesses** |
| Auth | **Auth.js v5** (credentials, JWT session) — TD-0103 **DONE** |
| Zod | **Env validation** (`lib/validations/env.ts`) |
| Git repository | Not initialized |
| Phase 0 QA (npm) | **Passed** (2026-05-21) |
| Milestone 1 QA (npm) | **Passed** (2026-05-21) |
| TD-0101 / TD-0102 | **DONE** (2026-05-21) |
| TD-0103 | **DONE** (2026-05-21) |
| TD-0104 | **DONE** (2026-05-21) |
| Unit tests (Vitest) | **89 passing** |
| Milestone 3 (reviews) | **DONE** (2026-05-22) |
| Milestone 3 QA (reviews) | **Passed** (2026-05-22) |
| Milestone 4 (complaints) | **DONE** (2026-05-22) |
| Milestone 4 QA (complaints) | **Passed** (2026-05-22) |
| Milestone 2 QA (directory) | **Passed** (2026-05-21) |

**MVP scope (unchanged):** auth, business directory + profiles, reviews, complaints, business claims, owner + admin dashboards, basic trust score, search/filters.

---

## Repository inventory (2026-05-21)

### Files that exist

```txt
README.md
AGENTS.md
ARCHITECTURE.md
TASKS.md
PROGRESS.md
KNOWN-ISSUES.md
```

### Application structure

```txt
app/                    pages, auth API, dashboard, login/register
components/             layout/, auth/, ui/
lib/                    auth/, db/, permissions/, validations/
prisma/                 schema + migrations + seed
server/                 actions/, queries/
types/                  auth, next-auth
docker-compose.yml
.env.example
```

### Planning review (2026-05-21)

| Check | Result |
|-------|--------|
| All six planning docs present | Yes |
| Implementation order documented | Yes |
| Main modules identified | Yes |
| Assumptions documented | Yes |
| MVP scope realistic | Yes |

Remaining gap: git repo not initialized.

---

## Main modules (summary)

See `ARCHITECTURE.md` § Main modules for full table. Core MVP modules: presentation, API/server, permissions, trust-score, moderation, validations, search, storage (later), auth, database.

---


## Short implementation plan

Execute in order. Each phase should finish validation (`pnpm lint`, `pnpm typecheck`, `pnpm test` when available) before moving on.

### Phase 0 — Foundation (P0)

| Step | Task ID | Outcome |
|------|---------|---------|
| 0.1 | TD-0001 | ~~Init Next.js~~ **DONE** |
| 0.2 | — | Init git (optional); `.env.example` **DONE** |
| 0.3 | TD-0003 | ~~ESLint, Prettier, typecheck~~ **DONE** |
| 0.4 | TD-0101 | ~~Prisma + PostgreSQL~~ **DONE** (Docker, port 5433) |
| 0.5 | TD-0102 | ~~Core schema + migration~~ **DONE** |
| 0.6 | TD-0103 | Auth (register, login, logout, protected routes) |
| 0.7 | TD-0104 | `lib/permissions` + tests |

**Exit criteria:** App runs locally; user can sign up/login; schema migrated; lint/typecheck pass.

### Phase 1 — Public discovery (P0)

| Step | Task ID | Outcome |
|------|---------|---------|
| 1.1 | TD-0201 | Category seed script |
| 1.2 | TD-0202 | `/businesses` listing (pagination, empty/loading states) |
| 1.3 | TD-0203 | Search + filters (URL query params) |
| 1.4 | TD-0204 | `/businesses/[slug]` profile (public info, trust label placeholder) |

**Exit criteria:** Anonymous users can browse and open business profiles.

### Phase 2 — Reviews + moderation core (P0)

| Step | Task ID | Outcome |
|------|---------|---------|
| 2.1 | TD-0301 | Review submission flow |
| 2.2 | TD-0302 | `lib/moderation` status rules + tests |
| 2.3 | TD-0303 | Approved reviews on profile; author sees pending state |
| 2.4 | TD-0501 | `lib/trust-score` calculate + label + tests |
| 2.5 | TD-0502 | Recalculate score on review/complaint/verification changes |

**Exit criteria:** Users submit reviews; risky content queued; trust score updates deterministically.

### Phase 3 — Complaints (P0)

| Step | Task ID | Outcome |
|------|---------|---------|
| 3.1 | TD-0401 | Complaint submission (proof optional, private by default) |
| 3.2 | TD-0402 | Status workflow + audit logging |
| 3.3 | TD-0403 | Public complaint summary on profile (careful wording) |

**Exit criteria:** Complaints submitted and moderated; no private proof on public pages.

### Phase 4 — Business ownership (P0)

| Step | Task ID | Outcome |
|------|---------|---------|
| 4.1 | TD-0601 | Business claim request + admin review |
| 4.2 | TD-0602 | Business dashboard (edit profile, reply to reviews/complaints) |
| 4.3 | TD-0603 | Verification badges on profile |

**Exit criteria:** Verified owners manage only their claimed businesses.

### Phase 5 — Admin + files + launch prep (P0–P1)

| Step | Task ID | Outcome |
|------|---------|---------|
| 5.1 | TD-0701–0704 | Admin dashboard + moderation queues + audit logs |
| 5.2 | TD-0801–0802 | File upload service; proof on review/complaint |
| 5.3 | TD-0901–0904 | Domain tests, fake seed data, SEO metadata, security pass |

**Exit criteria:** Full MVP flows in `AGENTS.md` QA list work end-to-end locally.

### Explicitly out of MVP scope

Mobile app, browser extension, badge widget, advanced fraud ML, monetization (see `TASKS.md` backlog).

---

## Decisions to confirm before Phase 0

| Decision | Recommendation | Blocker if unresolved |
|----------|----------------|----------------------|
| Auth provider | Auth.js (per README) | Blocks TD-0103 |
| Package manager | pnpm (per README) | Blocks consistent scripts |
| Postgres host | Neon or local Docker | Blocks TD-0101 |
| File storage | Cloudinary or S3-compatible | Blocks TD-0801 (can defer to Phase 5) |
| shadcn/ui | Yes for faster trustworthy UI | Optional; not blocking |

Record final choices in `README.md` and close **KI-0001** in `KNOWN-ISSUES.md` after init.

---

## Risks and blockers

| ID | Risk | Mitigation in plan |
|----|------|-------------------|
| KI-0001 | Stack not bound to code | Confirm during Phase 0.1 |
| KI-0002 | Legal wording on complaints/labels | Use moderation + safe labels from day one (Phase 2–3) |
| KI-0003 | Fake reviews | Rate limits + moderation queue in Phase 2 |
| KI-0004 | Business impersonation | Claim verification + admin approval in Phase 4 |
| KI-0005 | Proof file exposure | Private-by-default storage in Phase 3/5 |
| KI-0006 | Trust score fairness | Simple formula + tests in Phase 2 |
| KI-0007 | Moderation backlog | Start with minimal admin queues in Phase 5 |
| — | No git repo | Init git in Phase 0.2 |
| — | No database provisioned | Set up Postgres before TD-0101 |

---

## Active task

**TD-0301** — Review submission flow.

---

## Completed tasks

- Initial product and agent documentation (2026-05-21)
- Repository audit and implementation plan (2026-05-21)
- Planning review: assumptions, module index, contradiction fixes (2026-05-21)
- TD-0002 documentation (2026-05-21)
- **TD-0001** application foundation (2026-05-21)
- **TD-0003** lint, format, typecheck (2026-05-21)
- **TD-0101** PostgreSQL + Prisma connection (2026-05-21)
- **TD-0102** core database schema + migration (2026-05-21)
- **TD-0103** Auth.js register, login, logout, protected dashboard (2026-05-21)
- **TD-0104** Permission helpers + Vitest tests (2026-05-21)
- **TD-0202** Business listing page `/businesses` (2026-05-21)
- **TD-0203** Search and filters on `/businesses` (2026-05-21)
- **TD-0204** Full business profile `/businesses/[slug]` (2026-05-21)

---

## Blocked tasks

None.

---

## Work log

### 2026-05-21 - Initial documentation setup

#### Completed

- Created initial project documentation structure.
- Defined product scope, architecture, tasks, risks, and agent workflow.

#### Changed files

- `README.md`, `AGENTS.md`, `ARCHITECTURE.md`, `TASKS.md`, `PROGRESS.md`, `KNOWN-ISSUES.md`

#### Validation

- `pnpm lint`: not available
- `pnpm typecheck`: not available
- `pnpm test`: not available

#### Next suggested task

- **TD-0001:** Initialize Next.js project and tooling.

---

### 2026-05-21 - Cursor agent (repository audit)

#### Completed

- Audited full repository (documentation-only).
- Documented missing setup files and doc/task drift.
- Added phased implementation plan above.

#### Changed files

- `PROGRESS.md`

#### Validation

- `pnpm lint`: not available (no `package.json`)
- `pnpm typecheck`: not available
- `pnpm test`: not available

#### Issues found

- No application codebase.
- No git repository.
- `TASKS.md` TD-0002 status outdated (docs already exist).

#### Next suggested task

- **TD-0001:** Initialize Next.js + TypeScript + Tailwind + `.env.example` + `.gitignore`.

---

### 2026-05-21 - Cursor agent (planning review)

#### Completed

- Reviewed all six planning docs against checklist.
- Fixed route, entity, and helpful-vote contradictions across `README.md`, `ARCHITECTURE.md`, `TASKS.md`.
- Added assumptions table, main modules table, implementation order in `TASKS.md`.
- Marked TD-0002 DONE; added KI-0011, resolved KI-0012.

#### Changed files

- `README.md`, `ARCHITECTURE.md`, `TASKS.md`, `KNOWN-ISSUES.md`, `PROGRESS.md`, `AGENTS.md`

#### Validation

- `pnpm lint`: not available
- `pnpm typecheck`: not available
- `pnpm test`: not available

#### Next suggested task

- **TD-0001:** Initialize Next.js project.

---

### 2026-05-21 - Cursor agent (application foundation)

#### Completed

- Initialized Next.js 15 (App Router) + React 19 + TypeScript (strict).
- Configured Tailwind CSS v4 with TrustDoko theme tokens.
- Added ESLint (Next.js) + Prettier + `lint` / `typecheck` / `format` scripts.
- Created folder structure: `app/`, `components/`, `components/ui/`, `lib/`, `prisma/`, `types/`, `server/actions/`, `server/queries/`.
- Added base layout, header/footer, landing page, route placeholders (`/businesses`, `/about`).
- Added Prisma placeholder schema + `lib/db` client singleton.
- Added auth-ready stubs (`lib/auth/`) and Zod env validation.
- Added `.env.example`, `.gitignore`.

#### Changed files

- `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
- `eslint.config.mjs`, `.prettierrc`, `.prettierignore`, `.env.example`, `.gitignore`
- `app/**`, `components/**`, `lib/**`, `prisma/schema.prisma`, `server/**`, `types/**`
- `README.md`, `TASKS.md`, `PROGRESS.md`

#### Validation

- `pnpm typecheck`: pass
- `pnpm lint`: pass
- `pnpm build`: pass

#### Notes

- Package name is `trustdoko` (npm does not allow capitals in project name).
- Run `pnpm db:migrate` after setting `DATABASE_URL` in `.env`.
- Auth.js integration deferred to TD-0103.

#### Next suggested task

- **TD-0102:** Core database schema.
- **TD-0101:** Wire PostgreSQL and first migration.

---

### 2026-05-21 - Phase 0 quality check (npm)

#### Checklist

| # | Check | Result |
|---|--------|--------|
| 1 | `npm install` succeeds | Pass (after clean `node_modules`; `.npmrc` added) |
| 2 | `npm run dev` runs locally | Pass — http://localhost:3000 returns 200 |
| 3 | TypeScript | Pass — `npx tsc --noEmit` |
| 4 | Lint | Pass — `npm run lint` |
| 5 | Tailwind | Pass — theme classes in rendered HTML (`text-primary`, `bg-card`, etc.) |
| 6 | Folder structure | Pass — `app/`, `components/`, `lib/`, `prisma/`, `types/`, `server/` |
| 7 | Environment variables | Pass — `.env.example` documents all vars |
| 8 | README.md | Pass — setup + npm/pnpm commands |
| 9 | PROGRESS.md | Pass — this entry |
| 10 | Dependencies | Pass — no unnecessary packages; all deps used or required for tooling |

#### Commands run

```bash
npm install          # pass
npm run dev          # pass (verified HTTP 200)
npm run build        # pass
npm run lint         # pass
npx tsc --noEmit     # pass
```

#### Fixes applied

- Added `.npmrc` (`legacy-peer-deps=true`) for reliable `npm install` on Windows.
- Regenerated `node_modules` via npm (do not mix npm/pnpm installs without deleting `node_modules` first).
- Added `package-lock.json` for npm users.

#### Dependency audit

| Package | Verdict |
|---------|---------|
| `next`, `react`, `react-dom` | Required |
| `@prisma/client`, `prisma` | Required (schema + postinstall) |
| `zod` | Used in `lib/validations/env.ts` |
| `clsx`, `tailwind-merge` | Used in `lib/utils.ts` |
| `tailwindcss`, `@tailwindcss/postcss` | Required for styling |
| `eslint*`, `prettier*` | Required for lint/format |
| `@eslint/eslintrc` | Required for flat ESLint + Next config |

No packages removed.

#### Next suggested task

- **TD-0102** / **TD-0101** — core schema and PostgreSQL migration.

---

### 2026-05-21 - PostgreSQL + core schema (Docker)

#### Completed

- Added `docker-compose.yml` (Postgres 16, host port **5433**).
- Implemented full Prisma schema (User, Business, Category, Review, Complaint, claims, files, audit).
- Applied migration `20260521150137_init`.
- Seeded 10 MVP categories.
- Added `lib/db/health.ts`, `server/queries/health.ts`, `npm run docker:*` and `db:seed` scripts.

#### Changed files

- `docker-compose.yml`, `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/migrations/`
- `.env.example`, `package.json`, `lib/db/`, `server/queries/health.ts`
- `README.md`, `TASKS.md`, `PROGRESS.md`

#### Validation

- `docker compose up -d`: pass
- `npm run db:migrate`: pass
- `npm run db:seed`: pass (10 categories)
- `npm run typecheck`: pass

#### Notes

- Port **5433** used because local PostgreSQL often occupies **5432** on Windows.
- `.env` is gitignored; copy from `.env.example` on new machines.

#### Next suggested task

- **TD-0103:** Auth.js integration.

---

### 2026-05-21 - TD-0103 Auth.js

#### Completed

- Auth.js v5 with Credentials provider (email/password, bcrypt).
- Routes: `/login`, `/register`, `/api/auth/[...nextauth]`.
- Server actions: `registerAction`, `loginAction`, `logoutAction`.
- Protected `/dashboard/*` via middleware (`getToken`) + layout guard.
- Session exposes `id`, `email`, `name`, `role` via `getSessionUser()`.
- Header shows Sign in / Register or Dashboard / Sign out.

#### Changed files

- `lib/auth/auth.config.ts`, `lib/auth/session.ts`, `lib/auth/password.ts`
- `middleware.ts`, `server/actions/auth.ts`, `lib/validations/auth.ts`
- `app/login/`, `app/register/`, `app/dashboard/`
- `components/auth/*`, `components/layout/site-header.tsx`
- `types/next-auth.d.ts`, `package.json`, `README.md`, `TASKS.md`, `.env.example`

#### Validation

- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run build`: pass

#### Next suggested task

- **TD-0104:** Permission helpers.

---

### 2026-05-21 - TD-0104 Permission helpers

#### Completed

- Added `lib/permissions/` with admin, review, business, and complaint checks.
- Added Prisma-backed async helpers (`canEditReviewById`, `canManageBusinessById`, etc.).
- Added `requireAuth` / `requireAdmin` throw helpers for server actions.
- Added Vitest with 28 unit tests (`npm test`).

#### Changed files

- `lib/permissions/**`, `vitest.config.ts`, `package.json`
- `README.md`, `TASKS.md`, `PROGRESS.md`

#### Validation

- `npm test`: pass (28 tests)
- `npm run typecheck`: pass
- `npm run build`: pass

#### Next suggested task

- **TD-0202:** Business listing page.

---

### 2026-05-21 - Prisma schema expansion

#### Completed

- Expanded schema: User, Business, Category, Review, Complaint, BusinessClaim, BusinessVerification, ReviewVote, SavedBusiness, BusinessResponse, AuditLog, FileAsset.
- Renamed `VerificationRequest` → `BusinessVerification`.
- Moved owner replies to `BusinessResponse` (removed inline reply fields on Review/Complaint).
- Migration `20260521152858_expand_mvp_schema`.
- Seed: 10 categories + 12 `[Sample]` businesses.
- DB helpers: `db` alias, `runInTransaction`, type re-exports.
- npm scripts: `db:reset`, `db:status`, `db:migrate:deploy`.
- Updated `ARCHITECTURE.md` model documentation.

#### Changed files

- `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/migrations/`
- `lib/db/`, `package.json`, `README.md`, `ARCHITECTURE.md`, `PROGRESS.md`

#### Validation

- `prisma migrate dev`: pass
- `npm run db:seed`: pass
- `npm run typecheck`: pass
- `npm run db:seed`: pass

#### Next suggested task

- **TD-0202:** Business listing page using seeded businesses.

---

### 2026-05-21 - TD-0202 Business listing page

#### Completed

- `/businesses` lists seeded businesses from PostgreSQL (12 per page).
- Shows name, category, city, rating, trust label badge, complaint count.
- Pagination via `?page=` query param.
- `loading.tsx` skeleton, empty state component.
- Responsive 1-column mobile / 2-column sm+ grid.
- `lib/trust-score/labels.ts` for MVP trust labels on cards.
- Minimal `/businesses/[slug]` stub until TD-0204.

#### Changed files

- `app/businesses/page.tsx`, `app/businesses/loading.tsx`, `app/businesses/[slug]/page.tsx`
- `components/business/*`, `server/queries/businesses.ts`
- `lib/trust-score/labels.ts`, `lib/validations/business-list.ts`
- `TASKS.md`, `PROGRESS.md`

#### Validation

- `npm run typecheck`: pass
- `npm test`: pass (33 tests)
- `npm run lint`: pass
- `npm run build`: pass

#### Next suggested task

- **TD-0203:** Search and filters.

---

### 2026-05-21 - Milestone 2 quality check (business directory)

#### Checklist

| # | Check | Result |
|---|--------|--------|
| 1 | Business listing `/businesses` loads | **Pass** |
| 2 | Profile loads by slug | **Pass** (`sample-kathmandu-threads`) |
| 3 | Search (name, city, social) | **Pass** |
| 4 | Filters (individual + combined) | **Pass** |
| 5 | Sort (trust, rating, reviews, newest) | **Pass** |
| 6 | Empty state (no results) | **Pass** |
| 7 | Loading states (listing + profile) | **Pass** |
| 8 | Business cards show trust/rating/verification | **Pass** |
| 9 | Profile with missing optional fields | **Pass** (null-safe components) |
| 10 | Responsive layout | **Pass** (mobile-first grid/filters) |
| 11 | Efficient queries | **Pass** (parallel listing fetch; `cache()` profile dedupe; single `groupBy` for complaints) |
| 12 | PROGRESS.md updated | **Pass** (this entry) |

#### Fixes applied during QA

- Invalid URL filter params no longer 500 (Zod `.catch()` on enums/coercion).
- `getBusinessProfile` wrapped in React `cache()` to avoid duplicate DB fetch (metadata + page).
- Complaint counts use one `groupBy` query instead of two `count` queries.
- Added [`app/not-found.tsx`](app/not-found.tsx) for invalid business slugs.
- Clean `.next` + rebuild if dev Turbopack corrupts production `next start` (missing `[turbopack]_runtime.js`).

#### Commands

```bash
npm run lint          # pass
npm run typecheck     # pass
npm run build         # pass
npm test              # pass (40 tests)
```

Manual HTTP QA (production `next start -p 3011` after clean build): all listing/search/filter/sort/profile/empty/invalid-slug scenarios **pass**.

#### Next suggested task

- **TD-0301:** Review submission flow.

---

### 2026-05-22 - Milestone 4: Complaint / report system (TD-0401–0403)

#### Completed

- Schema: `experienceDate`, `amountRange`, `allowAdminContact`; categories `MISLEADING_PRICING`, `NO_RESPONSE`, `DUPLICATE_BUSINESS` (migration `complaint_submission_fields`).
- Domain: `lib/complaints/*`, `lib/validations/complaint.ts`, `lib/moderation/complaint-status.ts`, status transitions + audit logging.
- Actions: `submitComplaintAction`, `respondToComplaintAction`, `updateComplaintStatusAction` (admin).
- Profile: four-bucket public summary; `#report-issue` form; `/report/[slug]` redirects to profile anchor.
- Dashboard: user complaint list with status labels.
- Owner panel: claimed owners respond via `BusinessResponse` → `BUSINESS_RESPONDED`.
- Seed: sample complaints + claimed `sample-valley-mobile-hub` for owner testing.
- Neutral public copy (Under Review, Unresolved Complaints); no scam auto-labeling.

#### Validation

- `npm test`: pass
- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run build`: pass

#### Next suggested task

- **TD-0501:** Trust score calculation module, or **TD-0601:** Business claim flow.

---

### 2026-05-22 - Milestone 4 quality check (complaint system)

#### Checklist

| # | Check | Result |
|---|--------|--------|
| 1 | Logged-in users can submit complaints | **Pass** — `submitComplaintAction` + `ComplaintForm` on profile `#report-issue` |
| 2 | Logged-out users cannot submit complaints | **Pass** — `ComplaintSignInCta` only; server action returns sign-in error; `/dashboard` middleware |
| 3 | Complaint validation works | **Pass** — Zod in `lib/validations/complaint.ts` (5 tests) |
| 4 | Complaint categories are correct | **Pass** — 9 public categories + labels (`lib/complaints/__tests__/categories.test.ts`) |
| 5 | Complaint statuses work correctly | **Pass** — initial status rules + transition map (9 tests) |
| 6 | Private proof is not publicly visible | **Pass** — explicit selects omit `proofFileId`; disabled upload UI; no proof in profile query |
| 7 | Business profile shows complaint summary | **Pass** — four buckets in `BusinessProfileComplaints` |
| 8 | User dashboard shows user's own complaints | **Pass** — `getDashboardComplaints` scoped to session user |
| 9 | Owner responds only on own claimed business | **Pass** — `canReplyToComplaint` owner-only; action + panel enforce |
| 10 | Users cannot access others' private complaint details | **Pass** — `getUserComplaints` throws on userId mismatch; no public detail route |
| 11 | Public wording avoids risky scam labels | **Pass** — neutral summary copy; trust label uses "High Risk" only |
| 12 | PROGRESS.md updated | **Pass** (this entry) |

#### Fixes during QA

- `canReplyToComplaint` restricted to claimed business owner (admins use status moderation, not owner replies).
- Owner panel shows respond form only when `canReplyToComplaint`; admins see read-only private details.
- `getUserComplaints(userId, requesterId)` forbids cross-user reads; dashboard uses `getDashboardComplaints`.
- `lib/complaints/selects.ts` documents safe Prisma fields for dashboard and owner panel queries.

#### Commands

```bash
npm run lint          # pass
npm run typecheck     # pass
npm test              # pass (89)
npm run build         # pass
```

#### Next suggested task

- **TD-0501:** Trust score calculation module, or **TD-0601:** Business claim flow.

---

### 2026-05-22 - Milestone 3: Review system (TD-0301–0304)

#### Completed

- Schema: `wouldRecommend`, `tags[]` on `Review` (migration `review_would_recommend_tags`).
- `lib/validations/review.ts`, `lib/moderation/review-status.ts`, `lib/reviews/aggregates.ts`, `lib/reviews/rate-limit.ts`.
- Server actions: submit, update, delete, helpful vote (`server/actions/reviews.ts`).
- Review form on business profile (`#write-review`); sign-in CTA for guests.
- Approved reviews paginated (`?reviewPage=`); pending banner for author.
- Edit/delete own review; one review per user per business.
- Auto-approve normal reviews; `PENDING` for scam/fraud/fake/harassment/abuse keywords.
- `reviewCount` / `averageRating` recalculated on approve/update/delete.
- Helpful votes via `ReviewVote` + denormalized `helpfulCount`.
- `/write-review/[slug]` redirects to profile anchor.
- Dashboard lists user reviews with edit links.
- Login accepts any safe `callbackUrl` (e.g. return to profile after review).

#### Validation

- `npm test`: pass (47)
- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run build`: pass

#### Next suggested task

- **TD-0401:** Complaint submission flow.

---

### 2026-05-22 - Milestone 3 quality check (review system)

#### Checklist

| # | Check | Result |
|---|--------|--------|
| 1 | Logged-in users can submit reviews | **Pass** — `submitReviewAction` + profile form |
| 2 | Logged-out users prompted to sign in | **Pass** — `ReviewSignInCta` + login `callbackUrl` |
| 3 | Review validation works | **Pass** — Zod in `lib/validations/review.ts` (7 tests) |
| 4 | Approved reviews display publicly | **Pass** — `getApprovedReviewsForBusiness` filters `APPROVED` |
| 5 | Pending reviews hidden publicly | **Pass** — excluded from public query; author sees banner |
| 6 | Users can edit own reviews | **Pass** — `updateReviewAction` + edit form |
| 7 | Users cannot edit others' reviews | **Pass** — `canEditReview` enforced (10 permission tests) |
| 8 | Users can delete own reviews | **Pass** — `deleteReviewAction` |
| 9 | Helpful vote works | **Pass** — `voteReviewHelpfulAction`; no self-votes |
| 10 | Duplicate review prevention | **Pass** — `@@unique([businessId, userId])` + submit→update + P2002 handling |
| 11 | Average rating updates | **Pass** — `recalculateBusinessReviewAggregates` (approved only) |
| 12 | Review count updates | **Pass** — same aggregate helper |
| 13 | Risky keywords → PENDING | **Pass** — `lib/moderation/review-status.ts` (5 tests) |
| 14 | PROGRESS.md updated | **Pass** (this entry) |

#### Fixes during QA

- Empty `experienceType` from form no longer fails validation.
- Duplicate create race returns friendly error (Prisma `P2002`).
- Users cannot mark their own review helpful.
- Added tests: `lib/validations/__tests__/review.test.ts`, `lib/reviews/__tests__/rate-limit.test.ts`, `server/queries/__tests__/reviews.test.ts`.

#### Commands

```bash
npm run lint          # pass
npm run typecheck     # pass
npm test              # pass (59)
npm run build         # pass
```

#### Next suggested task

- **TD-0401:** Complaint submission flow.

---

### 2026-05-22 - App smoke test + dependency fix

#### Issue found

`package.json` had been corrupted: `next` was `^9.3.3` (invalid with Next Auth 5 / App Router) and a mistaken `openssl` npm package was added. Dev server failed with `Unknown option: --turbopack`; typecheck failed on missing `next` types.

#### Fix

- Restored `next` to `^15.1.0`, removed `openssl` dependency, ran clean `npm install`.
- Added npm `overrides` so nested deps cannot pin Next 9.

#### Smoke test (dev on http://localhost:3000)

| Route | Status |
|-------|--------|
| `/`, `/businesses`, search, profile, invalid slug | 200 |
| `/login`, `/register`, `/about` | 200 |
| `/api/auth/session` | 200 (`null` when logged out) |
| Server logs | No `[auth][error]` JWT errors |

#### Validation

- `npm run typecheck`: pass
- `npm test`: pass (40)
- `npm run build`: pass (edge/jose warnings in middleware only)

---

### 2026-05-21 - Business directory completion (gaps)

#### Completed

- Sort by trust score, rating, review count, or newest (`sort` URL param).
- Keyword search extended to category name and social/website URLs.
- Business cards: numeric trust score, trust label, verification badge.
- Profile header badges aligned with listing cards.
- Profile loading skeleton at `/businesses/[slug]/loading.tsx`.
- Trust legend copy on listing page; filtered-empty search tips.
- Vitest: `lib/search/__tests__/business-filters.test.ts` (6 tests).

#### Changed files

- `lib/validations/business-list.ts`, `lib/search/business-filters.ts`
- `server/queries/businesses.ts`
- `components/business/business-card.tsx`, `business-list-filters.tsx`, `verification-badge.tsx`, `business-profile-header.tsx`, `business-profile-skeleton.tsx`
- `app/businesses/page.tsx`, `app/businesses/[slug]/loading.tsx`

#### Validation

- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm test`: pass (39 tests)
- `npm run build`: pass

#### Next suggested task

- **TD-0301:** Review submission flow.

---

### 2026-05-21 - TD-0203 & TD-0204 Discovery complete

#### Completed

- Search/filters on `/businesses` (GET form, URL params, pagination preserved).
- Full profile at `/businesses/[slug]` with stats, reviews, complaints, CTAs.
- Placeholder routes: `/write-review/[slug]`, `/report/[slug]`, `/claim/[slug]`.
- `lib/search/business-filters.ts`, `server/queries/business-profile.ts`.
- Sample approved reviews in seed for demo.

#### Validation

- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run build`: pass

#### Next suggested task

- **TD-0301:** Review submission.

---

### 2026-05-21 - Milestone 1 quality check (npm)

Full Phase 1 / Milestone 1 sign-off (foundation + database + auth + permissions).

#### Checklist

| # | Check | Result |
|---|--------|--------|
| 1 | `npm install` | **Pass** |
| 2 | `npm run dev` | **Pass** (app ready; uses port 3001 if 3000 is busy) |
| 3 | `npx tsc --noEmit` | **Pass** |
| 4 | `npm run lint` | **Pass** |
| 5 | Tailwind | **Pass** (`text-primary`, `bg-card` in rendered HTML) |
| 6 | Folder structure | **Pass** (`app/`, `components/`, `lib/`, `prisma/`, `server/`, `types/`) |
| 7 | Environment variables | **Pass** (`.env.example` documents DB, auth, Cloudinary) |
| 8 | README.md | **Pass** (Docker, npm commands, auth routes) |
| 9 | PROGRESS.md | **Pass** (this entry) |
| 10 | Dependencies | **Pass** (removed deprecated `@types/bcryptjs`; all others justified) |

#### Commands run

```bash
npm install          # pass
npm run dev          # pass (Ready on http://localhost:3001)
npm run build        # pass
npm run lint         # pass
npx tsc --noEmit     # pass
npm test             # pass (28 tests)
```

#### Manual verification

- Home page HTTP 200 with TrustDoko branding and Tailwind classes.
- `/dashboard/user` returns 307 redirect when unauthenticated (middleware).

#### Dependency audit

| Package | Verdict |
|---------|---------|
| `next`, `react`, `react-dom` | Required |
| `next-auth`, `bcryptjs` | Auth (TD-0103) |
| `@prisma/client`, `prisma` | Database |
| `zod` | Validation |
| `clsx`, `tailwind-merge` | UI utilities |
| `vitest`, `tsx` | Tests + seed |
| Tooling (eslint, prettier, tailwind, typescript) | Required |

Removed: `@types/bcryptjs` (bcryptjs ships its own types).

#### Sign-off

**Milestone 1 complete.** Safe to start Milestone 2 (TD-0202 business listing).

---

## Agent update template

```md
## YYYY-MM-DD - <agent/tool name>

### Completed
- Item 1

### Changed files
- path/file.ts

### Validation
- `pnpm lint`: pass/fail/not available
- `pnpm typecheck`: pass/fail/not available
- `pnpm test`: pass/fail/not available

### Issues found
- Issue 1

### Notes
- Note 1

### Next suggested task
- Next task
```
