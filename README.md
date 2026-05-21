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
- pnpm 9+
- PostgreSQL 15+ (local Docker, Neon, or Supabase)

### First-time setup

```bash
# Install dependencies
pnpm install

# Copy environment template and edit values
cp .env.example .env

# Generate Prisma client (runs automatically on install)
pnpm db:generate

# Apply database schema (requires DATABASE_URL in .env)
pnpm db:migrate

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Common commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm format` | Prettier write |
| `pnpm db:migrate` | Prisma migrate dev |
| `pnpm db:studio` | Prisma Studio |

Package manager: **pnpm**. Stack defaults: see `ARCHITECTURE.md` § Assumptions.

---

## Environment variables

Example only. Keep secrets out of git.

```env
DATABASE_URL="postgresql://user:password@localhost:5432/trustdoko"
NEXTAUTH_SECRET="replace-me"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="replace-me"
CLOUDINARY_API_KEY="replace-me"
CLOUDINARY_API_SECRET="replace-me"
```

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

Next task: **TD-0101** (core database schema) and **TD-0103** (Auth.js).
