# TrustDoko

TrustDoko is a Nepal-focused trust and review platform for online businesses, social sellers, local shops, service providers, and digital-first brands.

The product helps users answer one question before they buy, book, visit, or send money:

> Can I trust this business?

TrustDoko is not only a business directory. It is a public trust layer for Nepali businesses using reviews, complaint history, business verification, owner responses, and transparent trust signals.

---

## Product position

TrustDoko combines ideas from Yelp, Trustpilot, Google Reviews, and complaint-resolution platforms, but focuses on Nepal-specific trust problems.

Primary focus for MVP:

- Instagram/Facebook sellers in Nepal
- Online clothing stores
- Electronics/mobile sellers
- Beauty/cosmetics sellers
- Travel and tour agencies
- Repair and service providers
- Cloud kitchens and online food sellers

The first version should focus on online sellers because this is where trust gaps are strongest.

---

## Core value proposition

For customers:

- Search businesses before buying.
- Read real reviews from Nepali users.
- Check complaint history.
- See whether the business is claimed or verified.
- Avoid risky sellers before making payments.

For businesses:

- Claim and manage their public profile.
- Build reputation through verified reviews.
- Respond to complaints publicly.
- Show transparency through verification badges.
- Use TrustDoko as proof of credibility.

For admins:

- Moderate reviews and complaints.
- Verify business claims.
- Detect spam, fake reviews, duplicate businesses, and abuse.
- Keep the platform fair for both customers and businesses.

---

## MVP scope

The MVP should include:

1. User authentication
2. Business directory with categories
3. Business profile pages
4. Review submission and display
5. Complaint/report submission
6. Business claim request
7. Business owner dashboard
8. Admin moderation dashboard
9. Basic trust score
10. Search and filters

Do not build every future feature in the MVP. Keep the first release small, usable, and trustworthy.

### MVP boundaries

In scope for first release (P0):

- Auth, business directory, profiles, search/filters
- Reviews with moderation
- Complaints with moderation (text-first; proof upload when file service exists)
- Business claims and owner dashboard
- Admin moderation queues and audit logs
- Basic deterministic trust score

Explicitly out of scope for MVP (defer):

- Helpful review votes (TD-0304, P2)
- In-app or email notifications
- Duplicate business merge tooling (admin manual workaround acceptable at launch)
- Browser extension, public badge widget, mobile app, monetization
- Advanced fraud ML and paid rating features

MVP is realistic for a small team if proof uploads and helpful votes ship after core text flows work. See `PROGRESS.md` for phased delivery.

---

## Recommended tech stack

Recommended default stack:

- Frontend: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI components: shadcn/ui or custom Tailwind components
- Backend: Next.js Route Handlers / Server Actions
- Database: PostgreSQL
- ORM: Prisma
- Auth: Auth.js for MVP (alternatives documented only for future consideration)
- File storage: Cloudinary, S3-compatible storage, or Supabase Storage
- Search: PostgreSQL full-text search first, Meilisearch later
- Deployment: Vercel + Neon/Supabase Postgres

Recommended MVP choice:

```txt
Next.js + TypeScript + Tailwind CSS + PostgreSQL + Prisma + Auth.js + Cloudinary
```

---

## Main user roles

```txt
USER       Normal customer/reviewer
BUSINESS   Business owner or profile manager
ADMIN      Platform moderator/admin
```

A user can later become a business owner after claiming a business.

---

## Core entities (MVP schema)

- User
- Business
- Category
- Review
- Complaint
- BusinessClaim
- VerificationRequest
- FileAsset
- AuditLog

Post-MVP entities (not required for first schema migration):

- ReviewVote (see TD-0304)
- Notification (in-app/email later)

See `ARCHITECTURE.md` for the full system design and `ARCHITECTURE.md` § Assumptions for planning defaults.

---

## Trust score concept

TrustDoko should use a transparent trust score based on multiple signals.

Example factors:

- Business verification status
- Number of reviews
- Review quality
- Recent review trend
- Serious complaints
- Complaint resolution rate
- Business response rate
- Account age
- Suspicious activity signals

Avoid automatically calling a business a scam. Use safer labels:

```txt
Highly Trusted
Trusted
Mixed Reputation
Risky
High Risk
Under Review
```

---

## Important product rules

1. TrustDoko must be fair to both customers and businesses.
2. Serious complaints should be moderated before being amplified.
3. Proof files must not be publicly exposed unless explicitly designed for public display.
4. Businesses should have the right to respond.
5. Reviews should be ranked by helpfulness, recency, quality, and trust signals.
6. Paid features must never improve ratings or hide valid negative reviews.
7. SEO pages must not expose private user information.
8. Admin actions should be logged.
9. Duplicate businesses should be mergeable.
10. Suspicious reviews should be flagged, not blindly deleted.

---

## Suggested folder structure

```txt
trustdoko/
  app/
    (public)/
      page.tsx
      businesses/
      businesses/[slug]/
      categories/[slug]/
    (auth)/
      login/
      register/
    dashboard/
      user/
      business/
      admin/
    api/
  components/
    ui/
    business/
    review/
    complaint/
    layout/
    forms/
  lib/
    auth/
    db/
    validations/
    trust-score/
    moderation/
    storage/
    search/
  prisma/
    schema.prisma
    seed.ts
  public/
  tests/
  README.md
  AGENTS.md
  ARCHITECTURE.md
  TASKS.md
  PROGRESS.md
  KNOWN-ISSUES.md
```

---

## Local setup

### Prerequisites

- Node.js 20+
- npm 10+ or pnpm 9+ (use **one** package manager per install; do not mix without reinstalling `node_modules`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended for local PostgreSQL)

### First-time setup

**1. Start PostgreSQL (Docker)**

```bash
npm run docker:up
```

This starts PostgreSQL 16 on **host port 5433** (avoids conflict with a local Postgres on 5432).

Credentials (default):

| Key | Value |
|-----|-------|
| User | `trustdoko` |
| Password | `trustdoko` |
| Database | `trustdoko` |
| URL | `postgresql://trustdoko:trustdoko@127.0.0.1:5433/trustdoko` |

**2. Install app and apply schema**

**npm:**

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

**pnpm:**

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed accounts (local QA only)

All seeded users share password **`trustdoko12`**. Business names are prefixed **`[Sample]`** and emails use **`@trustdoko.local`**.

| Role | Email | Use for |
|------|-------|---------|
| Reviewer | `sample-reviewer@trustdoko.local` | Submit reviews and complaints |
| Business owner (claimed) | `sample-owner@trustdoko.local` | Manage Valley Mobile Hub |
| Business owner (no claim) | `sample-unclaimed-owner@trustdoko.local` | Empty business dashboard / 404 on manage URLs |
| Admin | `admin@trustdoko.local` | Moderation queues at `/dashboard/admin` |

### Common commands

| npm | pnpm | Description |
|-----|------|-------------|
| `npm run docker:up` | — | Start Postgres container |
| `npm run docker:down` | — | Stop Postgres container |
| `npm run docker:logs` | — | Tail Postgres logs |
| `npm run dev` | `pnpm dev` | Dev server (Turbopack) |
| `npm run build` | `pnpm build` | Production build |
| `npm run start` | `pnpm start` | Production server |
| `npm run lint` | `pnpm lint` | ESLint |
| `npx tsc --noEmit` | `pnpm typecheck` | TypeScript check |
| `npm run format` | `pnpm format` | Prettier write |
| `npm run db:format` | — | Format `schema.prisma` |
| `npm run db:validate` | — | Validate schema against datasource |
| `npm run db:generate` | — | Regenerate Prisma Client |
| `npm run db:migrate` | `pnpm db:migrate` | Prisma migrate dev |
| `npm run db:seed` | `pnpm db:seed` | Seed categories + sample businesses |
| `npm run db:reset` | — | Reset DB and re-run migrations + seed |
| `npm run db:status` | — | Migration status |
| `npm run db:migrate:deploy` | — | Apply migrations (production) |
| `npm run db:studio` | `pnpm db:studio` | Prisma Studio |
| `npm test` | `pnpm test` | Run unit tests (Vitest) |

Stack defaults: see `ARCHITECTURE.md` § Assumptions.

### Database troubleshooting

- **P1000 authentication failed on port 5432:** Another PostgreSQL may be running locally. TrustDoko Docker uses **5433** — ensure `.env` matches `.env.example`.
- **Container not ready:** Run `npm run docker:logs` and wait for `database system is ready`.
- **Reset database:** `npm run docker:down` then `docker volume rm trustdoko_trustdoko_pgdata` (destroys data), then `npm run docker:up` and `npm run db:migrate`.
- **`prisma generate` EPERM on Windows:** Another process (often `npm run dev`) may lock `query_engine-windows.dll.node`. Stop the dev server, then run `npm run db:generate`. Migrate/seed/build can still work if the client was generated earlier.

---

## Environment variables

Example only. Keep secrets out of git.

```env
DATABASE_URL="postgresql://trustdoko:trustdoko@127.0.0.1:5433/trustdoko"
AUTH_SECRET="replace-me"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-me"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

Generate `AUTH_SECRET` with `openssl rand -base64 32`. See `.env.example` for the full template.

---

## Agent workflow

Before coding, agents must read:

1. `README.md`
2. `ARCHITECTURE.md`
3. `TASKS.md`
4. `PROGRESS.md`
5. `KNOWN-ISSUES.md`
6. `AGENTS.md`

Agents must update:

- `PROGRESS.md` after meaningful work
- `KNOWN-ISSUES.md` when bugs, risks, or unresolved decisions appear
- `TASKS.md` when task status changes
- `ARCHITECTURE.md` only when a real architecture decision changes the system

---

## Definition of done

A task is done only when:

- Feature works locally
- Types pass
- Lint passes
- Relevant tests pass or are added
- Edge cases are handled
- Loading and error states exist
- No secrets are committed
- Database changes have migrations
- UI works on mobile and desktop
- `PROGRESS.md` is updated

---

## Current status

Application foundation initialized (Next.js, TypeScript, Tailwind, Prisma, ESLint, Prettier).

| Doc | Purpose |
|-----|---------|
| `PROGRESS.md` | Phase, implementation order, work log |
| `TASKS.md` | Task IDs and acceptance criteria |
| `ARCHITECTURE.md` | Modules, routes, assumptions |
| `KNOWN-ISSUES.md` | Risks and open decisions |

Public discovery is live: `/businesses` with search/filters and `/businesses/[slug]` profiles. Next: **TD-0301** (reviews).

### Auth routes

| Route | Description |
|-------|-------------|
| `/register` | Create account (email + password) |
| `/login` | Sign in |
| `/dashboard/user` | Protected user dashboard |
| `/api/auth/*` | Auth.js handlers |

Server session: `getSessionUser()` from `@/lib/auth` or `auth()` from `@/lib/auth/auth.config`.
