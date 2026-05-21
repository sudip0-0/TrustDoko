# PROGRESS.md

This file tracks what has been completed, what changed, validation results, and next steps.

Agents must update this file after every meaningful coding session.

---

## Current project phase

**Milestone 1 (database) — in progress.**

PostgreSQL runs via Docker. Core Prisma schema migrated and categories seeded. Auth.js not implemented yet.

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
| Prisma | **Core schema** migrated (`20260521150137_init`) |
| PostgreSQL | **Docker** (`trustdoko-postgres`, port **5433**) |
| Seed data | **10 categories** (`npm run db:seed`) |
| Auth | **Stubs only** (`lib/auth/`) — TD-0103 next |
| Zod | **Env validation** (`lib/validations/env.ts`) |
| Git repository | Not initialized |
| Phase 0 QA (npm) | **Passed** (2026-05-21) |
| TD-0101 / TD-0102 | **DONE** (2026-05-21) |

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

### Application structure (created)

```txt
app/                    layout, globals.css, landing, placeholders
components/             layout/, ui/
lib/                    auth/, db/, validations/, utils.ts
prisma/                 schema.prisma (placeholder)
server/                 actions/, queries/
types/                  auth types
.env.example
package.json, tsconfig.json, eslint, prettier
```

### Planning review (2026-05-21)

| Check | Result |
|-------|--------|
| All six planning docs present | Yes |
| Implementation order documented | Yes — `TASKS.md` § Implementation order + phases below |
| Main modules identified | Yes — `ARCHITECTURE.md` § Main modules |
| Cross-file contradictions | Resolved (routes, entities, helpful votes); see KI-0012 |
| Assumptions documented | Yes — `ARCHITECTURE.md` § Assumptions |
| MVP scope realistic | Yes, if P2/deferred items honored (proof upload, helpful votes, notifications after core flows) |

Remaining gap: no application code or git repo yet.

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

**TD-0103** — Auth.js (register, login, session).

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
