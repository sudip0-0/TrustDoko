# PROGRESS.md

This file tracks what has been completed, what changed, validation results, and next steps.

Agents must update this file after every meaningful coding session.

---

## Current project phase

**Milestone 9 (quality and launch readiness) — complete.**

Domain test gaps filled, seed sign-off, SEO/Open Graph, claim/login rate limits, security review documented, KI-0005 resolved. **File upload security hardening** (magic-byte validation, extension blocklist, upload rate limits, orphan cleanup, owner proof route). Business claim document upload and response/rating database constraints are now implemented. Next: post-MVP enhancements (search, production rate limiting).

## 2026-05-24 - Codex

### Completed
- Built dedicated `/write-review/[businessSlug]` and `/report/[businessSlug]` pages using the existing review and complaint form components.
- Updated business profile CTAs to use the dedicated form pages and replaced the inline report form with a focused report entry section.
- Improved business profile tab navigation with active-section tracking and URL hash updates while scrolling.
- Refactored admin review and complaint moderation queues into scan-friendly table views with mobile card fallbacks, existing actions, and proof links preserved.

### Changed files
- `app/write-review/[businessSlug]/page.tsx`
- `app/report/[businessSlug]/page.tsx`
- `app/businesses/[slug]/page.tsx`
- `components/business/business-profile-actions.tsx`
- `components/business/profile-tabs-nav.tsx`
- `components/business/profile-section-nav.tsx`
- `app/dashboard/admin/reviews/page.tsx`
- `app/dashboard/admin/complaints/page.tsx`
- `server/actions/reviews.ts`

### Validation
- `pnpm typecheck`: pass
- `pnpm lint`: pass
- `pnpm test`: pass (207 tests)
- Route smoke test: blocked because local PostgreSQL was not reachable on `127.0.0.1:5433`; `pnpm docker:up` failed because Docker Desktop was not running.

### Notes
- No validation, moderation, proof privacy, or admin action server behavior was changed.
- The dedicated review route is revalidated after review submit/update/delete.

### Next suggested task
- Run a browser/mobile smoke pass for the new form routes and admin tables after Docker Desktop/PostgreSQL is available.

## 2026-05-24 - Codex

### Completed
- Added safe PostgreSQL check constraints for `Review.rating` and exactly one `BusinessResponse` target.
- Added matching app validation for business response targets.
- Wired private business-claim document uploads through the existing storage pipeline.
- Added admin claim document links through the existing signed proof route.
- Resolved KI-0015, KI-0017, and KI-0020.

### Changed files
- `prisma/migrations/20260524090000_add_response_and_rating_checks/migration.sql`
- `lib/business-responses/target.ts`
- `lib/business-responses/__tests__/target.test.ts`
- `server/actions/claims.ts`
- `server/actions/reviews.ts`
- `server/actions/complaints.ts`
- `components/claims/claim-form.tsx`
- `components/forms/proof-file-field.tsx`
- `components/admin/admin-proof-link.tsx`
- `app/claim/[businessSlug]/page.tsx`
- `app/dashboard/admin/claims/page.tsx`
- `server/queries/claims.ts`
- `lib/storage/access-proof.ts`
- `lib/storage/__tests__/access-proof.test.ts`
- `ARCHITECTURE.md`
- `KNOWN-ISSUES.md`

### Validation
- `pnpm lint`: pass
- `pnpm typecheck`: pass
- `pnpm test`: pass
- `pnpm db:validate`: pass
- `pnpm db:migrate`: fail (local Prisma schema engine returned no details; Docker Desktop engine is not running)

### Notes
- Claim documents use `FileVisibility.PRIVATE` and are not displayed on public business pages.
- Migration SQL is committed but was not applied locally because the local database/Docker runtime is unavailable.

### Next suggested task
- Add business profile image/gallery uploads as a separate public-media feature with explicit `PUBLIC` visibility rules.

---

## 2026-05-23 — Premium typography (Cursor)

### Completed
- Replaced Plus Jakarta Sans + Source Serif 4 with **DM Sans** (400–700) and **Geist Mono** for metrics; single sans family site-wide.
- Refined base palette (`#f8f7f4` background, `#1a1816` foreground) and global type scale in `app/globals.css` (`.type-display`, `.type-h1`–`.type-h3`, `.type-lead`, `.type-body`, `.type-caption`, `.type-eyebrow`, `.type-metric`, `.type-brand`).
- Migrated shared UI and high-traffic surfaces to type utilities: `PageHeader`, `FormPageShell`, `SectionHeader`, `Card`, home sections, business profile stats/ratings, dashboards, admin section headings, auth shells.
- Fixed `/businesses` header overlap (description merged into `PageHeader` as React node).
- Fixed `auth.config.ts` session callback typing (`typeof token.id === "string"`).

### Validation
- `pnpm lint`: pass
- `pnpm typecheck`: pass
- `pnpm test`: pass (202 tests)

### Notes
- UI-only; no behavior changes. Buttons use `rounded-lg` to match card system.

---

## 2026-05-23 — Mockup-inspired UI system (Cursor)

### Completed
- Home/search page with hero search, trust metrics bar, featured businesses, category chips, and public complaint snapshot (`server/queries/home.ts`, `components/home/*`, `app/page.tsx`).
- Business profile tabs (Overview, Reviews, Report, About), rating distribution chart, and complaint status chips on overview.
- Write review and complaint forms: private proof upload cues, live moderation warnings for risky language, clearer form sections.
- User complaints list with status stepper (Submitted → Under Review → Business responded → Resolved).
- Admin dashboard sidebar shell, privacy footer, and queue-focused overview header.
- Shared UI: `StatusChip`, `SubNav` consolidation, restrained `rounded-lg` cards, simplified site header with search entry.

### Changed files
- `app/page.tsx`, `app/businesses/[slug]/page.tsx`, `app/dashboard/admin/layout.tsx`, `app/dashboard/admin/page.tsx`, `app/globals.css`, `app/layout.tsx`
- `components/home/*`, `components/business/*`, `components/reviews/review-form.tsx`, `components/complaints/*`, `components/admin/*`, `components/dashboard/user-complaints-list.tsx`, `components/forms/*`, `components/layout/site-header.tsx`, `components/ui/*`
- `lib/moderation/moderation-language.ts`, `lib/copy/messages.ts`, `server/queries/home.ts`

### Validation
- `pnpm lint`: pass
- `pnpm typecheck`: pass
- `pnpm test`: pass (202 tests)

### Notes
- No auth, moderation, trust-score, or proof privacy behavior changed — UI only.
- Order/reference field on complaints is described in copy only (no new schema field).

### Next suggested task
- Add dedicated `/write-review` and `/report` standalone layouts matching mobile mockups; wire admin moderation table view for queue scanning.

---

## Current status summary


| Area                           | Status                                                       |
| ------------------------------ | ------------------------------------------------------------ |
| Product scope                  | Defined in `README.md`                                       |
| Architecture                   | Defined in `ARCHITECTURE.md`                                 |
| Task backlog                   | TD-0001, TD-0002, TD-0003 **DONE**                           |
| Next.js app                    | **Initialized** (App Router, landing page)                   |
| TypeScript                     | **Strict** (`strict`, `noUncheckedIndexedAccess`)            |
| Tailwind CSS                   | **Configured** (v4, `@theme` tokens)                         |
| ESLint / Prettier              | **Configured**                                               |
| Prisma                         | **MVP schema v2** (`expand_mvp_schema`)                      |
| PostgreSQL                     | **Docker** (`trustdoko-postgres`, port **5433**)             |
| Seed data                      | **10 categories + 12 sample businesses**                     |
| Auth                           | **Auth.js v5** (credentials, JWT session) — TD-0103 **DONE** |
| Zod                            | **Env validation** (`lib/validations/env.ts`)                |
| Git repository                 | Not initialized                                              |
| Phase 0 QA (npm)               | **Passed** (2026-05-21)                                      |
| Milestone 1 QA (npm)           | **Passed** (2026-05-21)                                      |
| TD-0101 / TD-0102              | **DONE** (2026-05-21)                                        |
| TD-0103                        | **DONE** (2026-05-21)                                        |
| TD-0104                        | **DONE** (2026-05-21)                                        |
| Unit tests (Vitest)            | **151 passing**                                              |
| Milestone 5 QA (trust score)   | **Passed** (2026-05-21)                                      |
| Milestone 7 (admin moderation) | **DONE** (2026-05-21)                                        |
| Milestone 7 QA (admin)         | **Passed** (2026-05-21)                                      |
| User & business dashboards     | **DONE** (2026-05-21)                                        |
| UI/UX overhaul                 | **DONE** (2026-05-21); mockup pass **DONE** (2026-05-23)     |
| Milestone 8 (file upload)      | **DONE** (2026-05-21)                                        |
| Milestone 9 (launch readiness) | **DONE** (2026-05-21)                                        |
| Milestone 3 (reviews)          | **DONE** (2026-05-22)                                        |
| Milestone 3 QA (reviews)       | **Passed** (2026-05-22)                                      |
| Milestone 4 (complaints)       | **DONE** (2026-05-22)                                        |
| Milestone 4 QA (complaints)    | **Passed** (2026-05-22)                                      |
| Milestone 6 (business claims)  | **DONE** (2026-05-22)                                        |
| Milestone 6 QA (claims)        | **Passed** (2026-05-21)                                      |
| Milestone 5 (trust score)      | **DONE** (2026-05-21)                                        |
| Milestone 2 QA (directory)     | **Passed** (2026-05-21)                                      |


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


| Check                           | Result |
| ------------------------------- | ------ |
| All six planning docs present   | Yes    |
| Implementation order documented | Yes    |
| Main modules identified         | Yes    |
| Assumptions documented          | Yes    |
| MVP scope realistic             | Yes    |


Remaining gap: git repo not initialized.

---

## Main modules (summary)

See `ARCHITECTURE.md` § Main modules for full table. Core MVP modules: presentation, API/server, permissions, trust-score, moderation, validations, search, storage (later), auth, database.

---

## Short implementation plan

Execute in order. Each phase should finish validation (`pnpm lint`, `pnpm typecheck`, `pnpm test` when available) before moving on.

### Phase 0 — Foundation (P0)


| Step | Task ID | Outcome                                              |
| ---- | ------- | ---------------------------------------------------- |
| 0.1  | TD-0001 | ~~Init Next.js~~ **DONE**                            |
| 0.2  | —       | Init git (optional); `.env.example` **DONE**         |
| 0.3  | TD-0003 | ~~ESLint, Prettier, typecheck~~ **DONE**             |
| 0.4  | TD-0101 | ~~Prisma + PostgreSQL~~ **DONE** (Docker, port 5433) |
| 0.5  | TD-0102 | ~~Core schema + migration~~ **DONE**                 |
| 0.6  | TD-0103 | Auth (register, login, logout, protected routes)     |
| 0.7  | TD-0104 | `lib/permissions` + tests                            |


**Exit criteria:** App runs locally; user can sign up/login; schema migrated; lint/typecheck pass.

### Phase 1 — Public discovery (P0)


| Step | Task ID | Outcome                                                             |
| ---- | ------- | ------------------------------------------------------------------- |
| 1.1  | TD-0201 | Category seed script                                                |
| 1.2  | TD-0202 | `/businesses` listing (pagination, empty/loading states)            |
| 1.3  | TD-0203 | Search + filters (URL query params)                                 |
| 1.4  | TD-0204 | `/businesses/[slug]` profile (public info, trust label placeholder) |


**Exit criteria:** Anonymous users can browse and open business profiles.

### Phase 2 — Reviews + moderation core (P0)


| Step | Task ID | Outcome                                                    |
| ---- | ------- | ---------------------------------------------------------- |
| 2.1  | TD-0301 | Review submission flow                                     |
| 2.2  | TD-0302 | `lib/moderation` status rules + tests                      |
| 2.3  | TD-0303 | Approved reviews on profile; author sees pending state     |
| 2.4  | TD-0501 | `lib/trust-score` calculate + label + tests                |
| 2.5  | TD-0502 | Recalculate score on review/complaint/verification changes |


**Exit criteria:** Users submit reviews; risky content queued; trust score updates deterministically.

### Phase 3 — Complaints (P0)


| Step | Task ID | Outcome                                                   |
| ---- | ------- | --------------------------------------------------------- |
| 3.1  | TD-0401 | Complaint submission (proof optional, private by default) |
| 3.2  | TD-0402 | Status workflow + audit logging                           |
| 3.3  | TD-0403 | Public complaint summary on profile (careful wording)     |


**Exit criteria:** Complaints submitted and moderated; no private proof on public pages.

### Phase 4 — Business ownership (P0)


| Step | Task ID | Outcome                                                        |
| ---- | ------- | -------------------------------------------------------------- |
| 4.1  | TD-0601 | Business claim request + admin review                          |
| 4.2  | TD-0602 | Business dashboard (edit profile, reply to reviews/complaints) |
| 4.3  | TD-0603 | Verification badges on profile                                 |


**Exit criteria:** Verified owners manage only their claimed businesses.

### Phase 5 — Admin + files + launch prep (P0–P1)


| Step | Task ID      | Outcome                                                   |
| ---- | ------------ | --------------------------------------------------------- |
| 5.1  | TD-0701–0704 | Admin dashboard + moderation queues + audit logs          |
| 5.2  | TD-0801–0802 | File upload service; proof on review/complaint            |
| 5.3  | TD-0901–0904 | Domain tests, fake seed data, SEO metadata, security pass |


**Exit criteria:** Full MVP flows in `AGENTS.md` QA list work end-to-end locally.

### Explicitly out of MVP scope

Mobile app, browser extension, badge widget, advanced fraud ML, monetization (see `TASKS.md` backlog).

---

## Decisions to confirm before Phase 0


| Decision        | Recommendation                | Blocker if unresolved                 |
| --------------- | ----------------------------- | ------------------------------------- |
| Auth provider   | Auth.js (per README)          | Blocks TD-0103                        |
| Package manager | pnpm (per README)             | Blocks consistent scripts             |
| Postgres host   | Neon or local Docker          | Blocks TD-0101                        |
| File storage    | Cloudinary or S3-compatible   | Blocks TD-0801 (can defer to Phase 5) |
| shadcn/ui       | Yes for faster trustworthy UI | Optional; not blocking                |


Record final choices in `README.md` and close **KI-0001** in `KNOWN-ISSUES.md` after init.

---

## Risks and blockers


| ID      | Risk                               | Mitigation in plan                                    |
| ------- | ---------------------------------- | ----------------------------------------------------- |
| KI-0001 | Stack not bound to code            | Confirm during Phase 0.1                              |
| KI-0002 | Legal wording on complaints/labels | Use moderation + safe labels from day one (Phase 2–3) |
| KI-0003 | Fake reviews                       | Rate limits + moderation queue in Phase 2             |
| KI-0004 | Business impersonation             | Claim verification + admin approval in Phase 4        |
| KI-0005 | Proof file exposure                | Private-by-default storage in Phase 3/5               |
| KI-0006 | Trust score fairness               | Simple formula + tests in Phase 2                     |
| KI-0007 | Moderation backlog                 | Start with minimal admin queues in Phase 5            |
| —       | No git repo                        | Init git in Phase 0.2                                 |
| —       | No database provisioned            | Set up Postgres before TD-0101                        |


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
- `app/`**, `components/`**, `lib/**`, `prisma/schema.prisma`, `server/**`, `types/**`
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


| #   | Check                      | Result                                                                  |
| --- | -------------------------- | ----------------------------------------------------------------------- |
| 1   | `npm install` succeeds     | Pass (after clean `node_modules`; `.npmrc` added)                       |
| 2   | `npm run dev` runs locally | Pass — [http://localhost:3000](http://localhost:3000) returns 200       |
| 3   | TypeScript                 | Pass — `npx tsc --noEmit`                                               |
| 4   | Lint                       | Pass — `npm run lint`                                                   |
| 5   | Tailwind                   | Pass — theme classes in rendered HTML (`text-primary`, `bg-card`, etc.) |
| 6   | Folder structure           | Pass — `app/`, `components/`, `lib/`, `prisma/`, `types/`, `server/`    |
| 7   | Environment variables      | Pass — `.env.example` documents all vars                                |
| 8   | README.md                  | Pass — setup + npm/pnpm commands                                        |
| 9   | PROGRESS.md                | Pass — this entry                                                       |
| 10  | Dependencies               | Pass — no unnecessary packages; all deps used or required for tooling   |


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


| Package                               | Verdict                                |
| ------------------------------------- | -------------------------------------- |
| `next`, `react`, `react-dom`          | Required                               |
| `@prisma/client`, `prisma`            | Required (schema + postinstall)        |
| `zod`                                 | Used in `lib/validations/env.ts`       |
| `clsx`, `tailwind-merge`              | Used in `lib/utils.ts`                 |
| `tailwindcss`, `@tailwindcss/postcss` | Required for styling                   |
| `eslint*`, `prettier*`                | Required for lint/format               |
| `@eslint/eslintrc`                    | Required for flat ESLint + Next config |


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
- Added `lib/db/health.ts`, `server/queries/health.ts`, `npm run docker:`* and `db:seed` scripts.

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
- Protected `/dashboard/`* via middleware (`getToken`) + layout guard.
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

- `lib/permissions/`**, `vitest.config.ts`, `package.json`
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
- `components/business/`*, `server/queries/businesses.ts`
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


| #   | Check                                         | Result                                                                                       |
| --- | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 1   | Business listing `/businesses` loads          | **Pass**                                                                                     |
| 2   | Profile loads by slug                         | **Pass** (`sample-kathmandu-threads`)                                                        |
| 3   | Search (name, city, social)                   | **Pass**                                                                                     |
| 4   | Filters (individual + combined)               | **Pass**                                                                                     |
| 5   | Sort (trust, rating, reviews, newest)         | **Pass**                                                                                     |
| 6   | Empty state (no results)                      | **Pass**                                                                                     |
| 7   | Loading states (listing + profile)            | **Pass**                                                                                     |
| 8   | Business cards show trust/rating/verification | **Pass**                                                                                     |
| 9   | Profile with missing optional fields          | **Pass** (null-safe components)                                                              |
| 10  | Responsive layout                             | **Pass** (mobile-first grid/filters)                                                         |
| 11  | Efficient queries                             | **Pass** (parallel listing fetch; `cache()` profile dedupe; single `groupBy` for complaints) |
| 12  | PROGRESS.md updated                           | **Pass** (this entry)                                                                        |


#### Fixes applied during QA

- Invalid URL filter params no longer 500 (Zod `.catch()` on enums/coercion).
- `getBusinessProfile` wrapped in React `cache()` to avoid duplicate DB fetch (metadata + page).
- Complaint counts use one `groupBy` query instead of two `count` queries.
- Added `[app/not-found.tsx](app/not-found.tsx)` for invalid business slugs.
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

### 2026-05-22 - Milestone 6: Business claiming and verification (TD-0601–0603)

#### Completed

- Schema: `BusinessClaim` owner contact fields + `TRUSTED_SELLER` verification tier.
- Claim flow: `[/claim/[slug]](app/claim/[businessSlug]/page.tsx)` form, profile CTA, pending banner.
- Actions: submit/approve/reject claims, owner profile edit, review respond, admin verification tier.
- Owner dashboard: `[/dashboard/business](app/dashboard/business/page.tsx)` and per-business manage page.
- Admin queue: `[/dashboard/admin/claims](app/dashboard/admin/claims/page.tsx)`.
- Verification badges: composite display (Unverified, Claimed, Contact/Document/Social/Trusted seller) + legend.
- Access control: owner routes use `isBusinessOwner`; profile edit and review respond actions require claimed ownership (admins use separate admin flows).

#### Validation

- `npm test`: pass (101)
- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run build`: pass

#### Next suggested task

- **TD-0801:** File upload service.

---

### 2026-05-21 - Milestone 7: Admin dashboard and moderation (TD-0701–0704)

#### Completed

- Layout: `[app/dashboard/admin/layout.tsx](app/dashboard/admin/layout.tsx)` with `requireAdminPage` + `[AdminNav](components/admin/admin-nav.tsx)`.
- Routes: overview, reviews, complaints, claims, businesses, users.
- Security: `[middleware.ts](middleware.ts)` blocks non-`ADMIN` on `/dashboard/admin/`*; all actions check `isAdmin`.
- Review moderation: approve, reject, flag, under review, delete — `[moderateReviewAction](server/actions/admin/reviews.ts)`.
- Complaint moderation: status updates + private admin note — `[moderateComplaintAction](server/actions/admin/complaints.ts)`.
- Claims: existing approve/reject with audit ( `[lib/claims/approve.ts](lib/claims/approve.ts)` ).
- User management: trust level / flag suspicious users — `[updateUserTrustLevelAction](server/actions/admin/users.ts)`.
- Audit trail: `[recordAuditLog](lib/moderation/audit-log.ts)` + overview `[AuditTrailList](components/admin/audit-trail-list.tsx)`.
- Stats: pending reviews, complaints, claims, totals on admin home.

#### Validation

- `npm test`: pass
- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run build`: pass

#### Next suggested task

- **TD-0801:** Secure proof file viewing for admins.

---

### 2026-05-21 - Milestone 7 QA: Admin and moderation quality check

#### QA checklist (11 items)


| #   | Check                                     | Result                                                                                              |
| --- | ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | Admin dashboard accessible only to admins | Pass — middleware + `requireAdminPage` layout + `requireAdminQuery` on all admin queries            |
| 2   | Normal users cannot access admin pages    | Pass — `USER` role redirected to `/dashboard/user` (middleware + layout)                            |
| 3   | Business owners cannot access admin pages | Pass — `BUSINESS` role same redirect; unit tests in `admin-access-qa.test.ts`                       |
| 4   | Review moderation actions work            | Pass — approve/reject/flag/under review/delete + transitions + audit                                |
| 5   | Complaint moderation actions work         | Pass — status updates + admin note + `moderateComplaintAction`                                      |
| 6   | Claim approval/rejection works            | Pass — `approveBusinessClaim` / `rejectBusinessClaim` + audit + trust recalc                        |
| 7   | Audit trail records admin actions         | Pass — `recordAuditLog` + claim audit rows; overview lists recent logs                              |
| 8   | Dashboard stats are accurate              | Pass — pending reviews = PENDING+UNDER_REVIEW; open complaints aligned with queue; claims = PENDING |
| 9   | Moderation updates public profile data    | Pass — `revalidatePath` on business slug + listings; only APPROVED reviews on public profile        |
| 10  | Trust score recalculates after moderation | Pass — review/complaint/claim actions call `recalculateTrustScore`                                  |
| 11  | PROGRESS.md updated                       | Pass — this section                                                                                 |


#### QA fixes (session)

- `requireAdminQuery()` on all admin data loaders (defense in depth beyond layout).
- Stats: pending reviews exclude FLAGGED (separate card); open complaints match moderation queue statuses.
- Admin actions revalidate `/businesses` listing after review/complaint changes.

#### Manual role access smoke


| Role            | `/dashboard/admin` | Expected                  |
| --------------- | ------------------ | ------------------------- |
| Unauthenticated | Redirect           | `/login?callbackUrl=...`  |
| `USER`          | Redirect           | `/dashboard/user`         |
| `BUSINESS`      | Redirect           | `/dashboard/user`         |
| `ADMIN`         | 200                | Admin overview with stats |


#### Validation (QA)

- `npm run lint`: pass
- `npm run typecheck`: pass
- `npm test`: pass
- `npm run build`: pass

---

### 2026-05-21 - Milestone 5: Trust score engine (TD-0501–0503)

#### Completed

- Schema: `trustScoreReasons` (JSON), `trustScoreUpdatedAt` on `Business`.
- Core: `lib/trust-score/` — `calculateTrustScore`, `gatherTrustScoreInputs`, `recalculateTrustScore`, labels incl. **Under Review**, neutral explanations.
- Formula (base 50): rating, review volume, complaints, verification tier, response rate, profile completeness, negative trend, account age.
- Hooks: review/complaint/verification/claim/profile/response actions call `recalculateTrustScore`.
- UI: `TrustScoreExplanation` on business profile; cards/header use `resolveTrustLabelForListing`; admin claims shows score + label; `/about` trust score section.
- Seed: recalculates all businesses after sample data load.

#### Validation

- `npm test`: pass
- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run build`: pass

#### Next suggested task

- **TD-0703:** Admin moderation UI.

---

### 2026-05-21 - Milestone 5 QA: Trust score quality check

#### QA checklist (12 items)


| #   | Check                                 | Result                                                                                         |
| --- | ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | Score always 0–100                    | Pass — `clampScore` + extreme-input tests                                                      |
| 2   | Score changes when reviews change     | Pass — rating/volume tests; `recalculateTrustScore` on review actions                          |
| 3   | Score changes when complaints change  | Pass — complaint penalty tests; hooks on complaint actions                                     |
| 4   | Score improves with verification      | Pass — tier bonus tests; verification/claim hooks                                              |
| 5   | Score improves with response behavior | Pass — response rate tests; review/complaint respond hooks                                     |
| 6   | Unresolved complaints reduce score    | Pass — dedicated unresolved penalty test                                                       |
| 7   | Labels match numeric ranges           | Pass — boundary tests 80/65/45/25; Under Review override                                       |
| 8   | Explanation text understandable       | Pass — educational factors (rating, complaints, verification, response) always in reasons      |
| 9   | No defamatory wording                 | Pass — banned-word scan over reasons/factors                                                   |
| 10  | Displays on cards and profiles        | Pass — `resolveTrustLabelForListing` / `resolveTrustLabelForBusiness`, `TrustScoreExplanation` |
| 11  | Tests cover major scenarios           | Pass — `trust-score-qa.test.ts` + calculate/labels/explanations suites                         |
| 12  | PROGRESS.md updated                   | Pass — this section                                                                            |


#### QA fixes (session)

- Clamp `responseRate`, `profileCompleteness`, `averageRating`, and counts in `calculateTrustScore`.
- Clamp `responseRate` in `gatherTrustScoreInputs`.
- Explanations always include key educational factors at zero impact.
- Stable list keys in `TrustScoreExplanation`.

#### Validation (QA)

- `npm test`: pass
- `npm run lint`: pass
- `npm run typecheck`: pass
- `npm run build`: pass

---

### 2026-05-21 - Milestone 6 QA: Business claim and verification quality check

#### QA checklist (10 items)


| #   | Check                                          | Result                                                                                            |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Users can submit business claim requests       | Pass — `/claim/[slug]`, `submitClaimAction`, auth required                                        |
| 2   | Claim requests stored correctly                | Pass — `BusinessClaim` fields + audit log                                                         |
| 3   | Duplicate claims prevented                     | Pass — pre-check + transactional re-check for PENDING/CLAIMED                                     |
| 4   | Owners access only approved claimed businesses | Pass — `getOwnedBusinesses` / `getBusinessForOwnerEdit` filter `CLAIMED` + `claimedByUserId`      |
| 5   | Owners cannot edit unclaimed businesses        | Pass — owner dashboard 404; `updateBusinessProfileAction` uses `isBusinessOwner`                  |
| 6   | Verification badges display correctly          | Pass — `getVerificationBadgeDisplay` + `VerificationBadge` + unit tests                           |
| 7   | Profile edit permissions restricted            | Pass — Zod allowlist + `buildOwnerUpdateData`                                                     |
| 8   | Review/complaint responses tied to owner       | Pass — `respondToReviewAction` / `respondToComplaintAction` require `isBusinessOwner` (non-admin) |
| 9   | Admin approve/reject claims                    | Pass — `/dashboard/admin/claims`, `approveClaimAction` / `rejectClaimAction`                      |
| 10  | PROGRESS.md updated                            | Pass — this section                                                                               |


#### Permission fixes (QA session)

- `updateBusinessProfileAction`: `canManageBusiness` → `isBusinessOwner` (admins no longer edit arbitrary profiles via owner action).
- `respondToReviewAction`: non-admins require `isBusinessOwner` on review’s business.
- `owner-reviews-panel`: respond UI gated with `isBusinessOwner`.
- `submitClaimAction`: transactional duplicate/race guard.
- `buildOwnerUpdateData`: allowlisted owner profile fields only.

#### Manual access-control smoke (seed users)


| Role           | Account                               | Verified                                                                                 |
| -------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| Normal user    | Register or use any non-owner account | Cannot open `/dashboard/business/[otherId]`; can submit claim on unclaimed business      |
| Business owner | `sample-owner@trustdoko.local`        | Sees `sample-valley-mobile-hub` only; can edit profile and respond to reviews/complaints |
| Admin          | `admin@trustdoko.local`               | `/dashboard/admin/claims` approve/reject; no owner profile edit via owner action         |


#### Validation (QA)

- `npm run lint`: pass
- `npm run typecheck`: pass
- `npm test`: pass (101)
- `npm run build`: pass

---

### 2026-05-22 - Milestone 4: Complaint / report system (TD-0401–0403)

#### Completed

- Schema: `experienceDate`, `amountRange`, `allowAdminContact`; categories `MISLEADING_PRICING`, `NO_RESPONSE`, `DUPLICATE_BUSINESS` (migration `complaint_submission_fields`).
- Domain: `lib/complaints/`*, `lib/validations/complaint.ts`, `lib/moderation/complaint-status.ts`, status transitions + audit logging.
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


| #   | Check                                                 | Result                                                                                             |
| --- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | Logged-in users can submit complaints                 | **Pass** — `submitComplaintAction` + `ComplaintForm` on profile `#report-issue`                    |
| 2   | Logged-out users cannot submit complaints             | **Pass** — `ComplaintSignInCta` only; server action returns sign-in error; `/dashboard` middleware |
| 3   | Complaint validation works                            | **Pass** — Zod in `lib/validations/complaint.ts` (5 tests)                                         |
| 4   | Complaint categories are correct                      | **Pass** — 9 public categories + labels (`lib/complaints/__tests__/categories.test.ts`)            |
| 5   | Complaint statuses work correctly                     | **Pass** — initial status rules + transition map (9 tests)                                         |
| 6   | Private proof is not publicly visible                 | **Pass** — explicit selects omit `proofFileId`; disabled upload UI; no proof in profile query      |
| 7   | Business profile shows complaint summary              | **Pass** — four buckets in `BusinessProfileComplaints`                                             |
| 8   | User dashboard shows user's own complaints            | **Pass** — `getDashboardComplaints` scoped to session user                                         |
| 9   | Owner responds only on own claimed business           | **Pass** — `canReplyToComplaint` owner-only; action + panel enforce                                |
| 10  | Users cannot access others' private complaint details | **Pass** — `getUserComplaints` throws on userId mismatch; no public detail route                   |
| 11  | Public wording avoids risky scam labels               | **Pass** — neutral summary copy; trust label uses "High Risk" only                                 |
| 12  | PROGRESS.md updated                                   | **Pass** (this entry)                                                                              |


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


| #   | Check                                | Result                                                                       |
| --- | ------------------------------------ | ---------------------------------------------------------------------------- |
| 1   | Logged-in users can submit reviews   | **Pass** — `submitReviewAction` + profile form                               |
| 2   | Logged-out users prompted to sign in | **Pass** — `ReviewSignInCta` + login `callbackUrl`                           |
| 3   | Review validation works              | **Pass** — Zod in `lib/validations/review.ts` (7 tests)                      |
| 4   | Approved reviews display publicly    | **Pass** — `getApprovedReviewsForBusiness` filters `APPROVED`                |
| 5   | Pending reviews hidden publicly      | **Pass** — excluded from public query; author sees banner                    |
| 6   | Users can edit own reviews           | **Pass** — `updateReviewAction` + edit form                                  |
| 7   | Users cannot edit others' reviews    | **Pass** — `canEditReview` enforced (10 permission tests)                    |
| 8   | Users can delete own reviews         | **Pass** — `deleteReviewAction`                                              |
| 9   | Helpful vote works                   | **Pass** — `voteReviewHelpfulAction`; no self-votes                          |
| 10  | Duplicate review prevention          | **Pass** — `@@unique([businessId, userId])` + submit→update + P2002 handling |
| 11  | Average rating updates               | **Pass** — `recalculateBusinessReviewAggregates` (approved only)             |
| 12  | Review count updates                 | **Pass** — same aggregate helper                                             |
| 13  | Risky keywords → PENDING             | **Pass** — `lib/moderation/review-status.ts` (5 tests)                       |
| 14  | PROGRESS.md updated                  | **Pass** (this entry)                                                        |


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

#### Smoke test (dev on [http://localhost:3000](http://localhost:3000))


| Route                                             | Status                        |
| ------------------------------------------------- | ----------------------------- |
| `/`, `/businesses`, search, profile, invalid slug | 200                           |
| `/login`, `/register`, `/about`                   | 200                           |
| `/api/auth/session`                               | 200 (`null` when logged out)  |
| Server logs                                       | No `[auth][error]` JWT errors |


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


| #   | Check                 | Result                                                                   |
| --- | --------------------- | ------------------------------------------------------------------------ |
| 1   | `npm install`         | **Pass**                                                                 |
| 2   | `npm run dev`         | **Pass** (app ready; uses port 3001 if 3000 is busy)                     |
| 3   | `npx tsc --noEmit`    | **Pass**                                                                 |
| 4   | `npm run lint`        | **Pass**                                                                 |
| 5   | Tailwind              | **Pass** (`text-primary`, `bg-card` in rendered HTML)                    |
| 6   | Folder structure      | **Pass** (`app/`, `components/`, `lib/`, `prisma/`, `server/`, `types/`) |
| 7   | Environment variables | **Pass** (`.env.example` documents DB, auth, Cloudinary)                 |
| 8   | README.md             | **Pass** (Docker, npm commands, auth routes)                             |
| 9   | PROGRESS.md           | **Pass** (this entry)                                                    |
| 10  | Dependencies          | **Pass** (removed deprecated `@types/bcryptjs`; all others justified)    |


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


| Package                                          | Verdict        |
| ------------------------------------------------ | -------------- |
| `next`, `react`, `react-dom`                     | Required       |
| `next-auth`, `bcryptjs`                          | Auth (TD-0103) |
| `@prisma/client`, `prisma`                       | Database       |
| `zod`                                            | Validation     |
| `clsx`, `tailwind-merge`                         | UI utilities   |
| `vitest`, `tsx`                                  | Tests + seed   |
| Tooling (eslint, prettier, tailwind, typescript) | Required       |


Removed: `@types/bcryptjs` (bcryptjs ships its own types).

#### Sign-off

**Milestone 1 complete.** Safe to start Milestone 2 (TD-0202 business listing).

---

### 2026-05-21 - User & business dashboards

#### Completed

**User dashboard** (`/dashboard/user`):

- Overview with profile summary, quick links, and notifications preview (review approved, business replied, complaint status, claim approved/rejected).
- Sub-routes: reviews, complaints, saved businesses, account settings.
- `UserSubNav`, empty states, `loading.tsx` with `DashboardSkeleton`.
- Saved businesses: `SavedBusiness` model queries, toggle on public profile, remove from dashboard.
- Account settings: `updateAccountAction` + `updateAccountSchema`.
- Access control: `getUserProfileSummary`, `getUserSavedBusinesses`, `getUserReviews` require `userId === requesterId`.

**Business dashboard** (`/dashboard/business`):

- Claimed-business list with trust score, verification badge, empty state.
- Per-business manage page: overview metrics, verification section, trust score explanation, profile edit, owner review/complaint response panels.
- `getBusinessForOwnerEdit` extended with trust fields; owner-only via `isBusinessOwner`.
- Layout + loading states for business routes.

**Shared**

- `max-w-6xl` dashboard layout; responsive grids and sub-navigation.
- Seed: two saved businesses for sample reviewer.

#### Key files

- `app/dashboard/user/`**, `app/dashboard/business/`**
- `components/dashboard/*`, `components/business/save-business-button.tsx`, `owner-business-overview.tsx`, `owner-verification-section.tsx`
- `server/queries/user-dashboard.ts`, `saved-businesses.ts`
- `server/actions/account.ts`, `saved-businesses.ts`

#### Validation

```bash
npm run lint       # pass
npm run typecheck  # pass
npm test           # pass (140)
npm run build      # pass
```

#### Next suggested task

- **TD-0801:** File uploads for claim/verification evidence.

---

### 2026-05-21 - Dashboard quality check (QA)

#### Checklist

| # | Check | Result |
|---|--------|--------|
| 1 | User dashboard shows only current user's reviews | **Pass** — `getUserReviews(userId, requesterId)` throws on mismatch; pages use `sessionUser.id` |
| 2 | User dashboard shows only current user's complaints | **Pass** — `getDashboardComplaints` → `getUserComplaints` with same guard |
| 3 | User dashboard empty states | **Pass** — `UserReviewsList`, `UserComplaintsList`, `SavedBusinessList`, business list `EmptyState` |
| 4 | Business dashboard shows only claimed businesses | **Pass** — `getOwnedBusinesses(viewer)` filters `CLAIMED` + `claimedByUserId` |
| 5 | Owner cannot view another owner's dashboard data | **Pass** — `getBusinessForOwnerEdit` + `notFound()`; owner panels return null for non-owners |
| 6 | Business profile edits validated | **Pass** — `updateBusinessProfileSchema` + `isBusinessOwner` on action; unit tests added |
| 7 | Review responses work | **Pass** — `respondToReviewAction` owner-only; seed adds approved review on Valley Mobile Hub for owner response UI |
| 8 | Complaint responses work | **Pass** — `respondToComplaintAction` + `canReplyToComplaint` (owner only) |
| 9 | Trust score explanation visible | **Pass** — `TrustScoreExplanation` on owner manage page |
| 10 | Dashboard works on mobile | **Pass** — responsive grids, `overflow-x-auto` sub-nav, `min-h-11` empty-state actions |
| 11 | PROGRESS.md updated | **Pass** (this section) |

#### Permission fixes (QA session)

- `respondToReviewAction`: removed admin bypass; owner-only replies on dashboard/public profile.
- `getOwnerComplaintsForBusiness`: verifies `businessId` matches ownership record before returning data.
- `getOwnedBusinesses`: accepts `SessionUser` only (no arbitrary `userId` parameter).
- `OwnerReviewsPanel`: returns null when viewer is not the claimed owner.
- User overview: `notFound()` when profile summary requester mismatch.
- Seed: passwords for manual login (`trustdoko12`); `sample-unclaimed-owner@trustdoko.local` for owner-without-claim QA.

#### Manual smoke (seed accounts, password `trustdoko12`)

| Role | Account | Verified |
|------|---------|----------|
| Normal user | `sample-reviewer@trustdoko.local` | `/dashboard/user` scoped data; `/dashboard/business/[id]` → **404** |
| Business owner (claimed) | `sample-owner@trustdoko.local` | Manage page shows trust explanation, profile edit, complaint response forms |
| Business owner (no claim) | `sample-unclaimed-owner@trustdoko.local` | `/dashboard/business` empty state; manage URL → **404** |
| Admin | `admin@trustdoko.local` | `/dashboard/admin` OK; owner manage URL → **404** (no cross-owner access) |

All accounts use password **`trustdoko12`** after `npm run db:seed`.

#### Validation (QA)

```bash
npm run lint       # pass
npm run typecheck  # pass
npm test           # pass (151)
npm run build      # pass
```

---

## UI/UX overhaul (2026-05-21)

### Design direction

- **Tone:** Clean, credible consumer-protection UX for Nepali shoppers (not generic SaaS gradients).
- **Typography:** Plus Jakarta Sans (UI) + Source Serif 4 (headings) in `app/layout.tsx`.
- **Color:** Warm stone neutrals + teal primary; semantic tokens for destructive, success, warning, trust bands in `app/globals.css`.
- **Copy:** Centralized in `lib/copy/messages.ts` (trust disclaimers, Nepal context, form helpers, empty states).

### What shipped

| Area | Highlights |
|------|------------|
| Foundation | `components/ui/*` (Button, Card, Badge, Alert, Input, Skeleton, PageHeader, FormSection); global `focus-visible`; `lib/trust-score/display-utils.ts` |
| Public | Home/about/directory refresh; sticky header + mobile nav; auth/claim card layouts; `ContentWidth`, filter card with active count |
| Trust | `TrustScoreDisplay` (compact/featured/inline); business cards + profile header/stats/explanation; badges via `ui/Badge` |
| Forms | Review, complaint, claim, owner responses, profile edit, account settings — shared Alert/Button/Input patterns |
| Dashboard | `DashboardShell`, `UserSubNav` + `DashboardNav` + `AdminNav` with `aria-current`; `EmptyState`/`Skeleton`; `app/dashboard/error.tsx`, admin `loading.tsx` |

### Manual test checklist

| Check | Notes |
|-------|-------|
| Mobile 375px | Home hero, directory filters stack, profile section nav, dashboard quick-link tiles |
| Keyboard | Tab through header nav, forms, filters; visible focus rings on buttons/inputs |
| Trust meter | Business card compact meter; profile header featured meter; owner dashboard cards |
| Forms | Success/error alerts (`role="status"` / `role="alert"`); submit disabled + `aria-busy` while pending |
| Dashboard | User sub-nav + top nav highlight active route; admin empty queues use `EmptyState` |
| Screen reader | Trust score `aria-label` on featured meter; empty regions `aria-labelledby` |

### Validation

```bash
npm run lint       # pass (after empty-state import fix)
npm run typecheck  # pass
npm test           # pass (151)
npm run build      # pass
```

Seed password for manual QA: **`trustdoko12`**.

---

## Milestone 8 — File upload (2026-05-21)

### TD-0801 / TD-0802

| Deliverable | Location |
|-------------|----------|
| Cloudinary SDK + env | `cloudinary` package; `CLOUDINARY_*` in `.env` / [`lib/validations/env.ts`](lib/validations/env.ts) |
| Storage module | [`lib/storage/`](lib/storage/) — validate, upload, signed URLs, permissions |
| Review proof | [`server/actions/reviews.ts`](server/actions/reviews.ts) submit/update |
| Complaint proof | [`server/actions/complaints.ts`](server/actions/complaints.ts) submit |
| Forms | [`components/forms/proof-file-field.tsx`](components/forms/proof-file-field.tsx); multipart when `isStorageConfigured()` |
| Admin viewer | [`app/api/admin/proof/[fileAssetId]/route.ts`](app/api/admin/proof/[fileAssetId]/route.ts); links on admin review/complaint queues |

**Rules:** JPEG/PNG/WebP/PDF, max 5 MB, `FileVisibility.PRIVATE`, Cloudinary `type: private`. Public/owner queries still omit `proofFileId` (see [`lib/complaints/selects.ts`](lib/complaints/selects.ts)).

### Manual test checklist

1. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `.env`.
2. Submit complaint with image proof → success; public profile has no proof URL.
3. Submit review with PDF proof → admin queue shows **View proof** (signed redirect).
4. Oversized or `.exe` file → field error, no DB row.
5. Logged-out or non-admin hitting `/api/admin/proof/...` → 403.

### Validation

```bash
npm run lint       # pass
npm run typecheck  # pass
npm test           # pass (155)
npm run build      # pass
```

**Follow-on:** claim document upload (`BusinessClaim.documentFileId`), orphan asset cleanup on replace, TD-0703 full owner proof access, TD-0904 security review.

---

## Milestone 9 — Quality and launch readiness (2026-05-21)

### TD-0901 — Tests

Added targeted coverage: `lib/storage/__tests__/permissions.test.ts`, `lib/complaints/__tests__/rate-limit.test.ts`, `severity.test.ts`, extended `status-transitions.test.ts`, `lib/permissions/__tests__/queries.test.ts`, `lib/auth/__tests__/login-rate-limit.test.ts`, `lib/claims/__tests__/rate-limit.test.ts`. Existing trust score, moderation, and permission suites retained.

### TD-0902 — Seed

[`prisma/seed.ts`](prisma/seed.ts) documents fake data; recalculates `reviewCount` / `averageRating` after sample reviews via `recalculateBusinessReviewAggregates`.

### TD-0903 — SEO

[`lib/seo/metadata.ts`](lib/seo/metadata.ts) + Open Graph on home, about, directory (including `?category=` titles), business profiles; [`public/og-default.svg`](public/og-default.svg).

### TD-0904 — Security review

| Control | Implementation |
|---------|----------------|
| Dashboard auth | `middleware.ts` + `app/dashboard/layout.tsx` |
| Admin | Middleware role check + `requireAdminPage` / `requireAdminQuery` |
| Ownership | `isBusinessOwner`, query guards (`dashboard-access.test.ts`) |
| Proof privacy | Private Cloudinary + selective selects + admin signed URL route |
| Rate limits | Reviews 10 min; complaints 3/day; claims 3/day; login 10 fails/15 min (in-memory, KI-0019) |

KI-0005 marked **RESOLVED**. Residual: KI-0004 impersonation, distributed login limiter (KI-0019).

### Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

---

## File upload security hardening (2026-05-21)

Senior review of Cloudinary proof pipeline (reviews + complaints). Fixes:

| Area | Change |
|------|--------|
| Validation | Magic-byte sniffing; extension allow/block lists; path traversal filenames rejected; MIME spoofing rejected |
| Storage | Explicit `image`/`raw` resource types (not `auto`); `private://` URLs in DB (no leaked `secure_url`) |
| Abuse | 15 uploads/user/hour; single file per form; rollback on failed entity create |
| Access | `canAccessProofAssetById` requires entity link; `/api/files/proof/[id]` for owners; admin route hardened |
| Cleanup | Replace/delete review proof removes old Cloudinary assets |

Tests: `lib/storage/__tests__/*` (sniff, filename, form-data, access-proof, rate-limit, validate-file).

Residual: KI-0020 (business docs/images not built), KI-0021 (no dimension cap).

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
