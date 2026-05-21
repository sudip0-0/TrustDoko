# KNOWN-ISSUES.md

This file tracks known issues, risks, unresolved decisions, and technical debt.

Agents must update this file when they find a bug, limitation, missing decision, security risk, or implementation gap.

Status values:

```txt
OPEN
IN_PROGRESS
RESOLVED
ACCEPTED_RISK
DEFERRED
```

Severity values:

```txt
CRITICAL
HIGH
MEDIUM
LOW
```

---

## Open issues

### KI-0013: Local PostgreSQL port conflict on Windows

Status: ACCEPTED_RISK  
Severity: LOW

Description:
Many developers run PostgreSQL on port 5432. TrustDoko Docker maps to host port **5433** to avoid authentication errors against the wrong server.

Impact:
Developers must use `127.0.0.1:5433` in `DATABASE_URL`, not 5432.

Recommended action:
Document in README (done). If 5433 is taken, change the host port in `docker-compose.yml` and `.env`.

---

### KI-0001: Final tech stack not yet confirmed

Status: RESOLVED  
Severity: MEDIUM

Description:
The recommended stack is Next.js, TypeScript, Tailwind, PostgreSQL, Prisma, and Auth.js. The actual implementation stack has not been confirmed by a real codebase yet.

Impact:
Setup commands, auth flow, storage integration, and deployment instructions may need updates after project initialization.

Recommended action:
Confirm stack during project setup and update `README.md`, `ARCHITECTURE.md`, and `TASKS.md`.

Resolution (2026-05-21):
Codebase uses Next.js 15, TypeScript (strict), Tailwind v4, Prisma 6, Zod, ESLint, Prettier, pnpm. Auth.js stubs in `lib/auth/`; full auth in TD-0103.

---

### KI-0002: Legal wording risk for complaints and trust labels

Status: OPEN  
Severity: HIGH

Description:
TrustDoko will handle negative reviews and complaints. Publicly calling a business a scam or fraud without careful moderation may create legal and reputational risk.

Impact:
Poor wording could harm businesses unfairly and expose the platform to complaints.

Recommended action:
Use careful public labels:

- Under Review
- High Risk
- Multiple Unresolved Complaints
- Mixed Reputation
- Complaint Reported

Avoid automatically publishing accusations as facts.

---

### KI-0003: Fake reviews and review manipulation risk

Status: OPEN  
Severity: HIGH

Description:
Businesses, competitors, or fake users may attempt to manipulate ratings.

Impact:
TrustDoko loses credibility if fake reviews dominate.

Recommended action:
Implement:

- Email/phone verification
- Rate limits
- Review moderation
- Helpful votes
- Suspicious pattern detection
- Admin review queue
- Proof-based credibility signals

---

### KI-0004: Business impersonation risk

Status: OPEN  
Severity: HIGH

Description:
A user may falsely claim a business profile.

Impact:
Fake owners could edit business details, respond to reviews, or manipulate public trust.

Recommended action:
Require business claim verification through at least one strong method:

- Phone/email OTP
- Website domain verification
- Social page ownership verification
- Business document upload
- Manual admin approval

---

### KI-0005: Proof file privacy risk

Status: OPEN  
Severity: CRITICAL

Description:
Complaint and review proof files may contain private information such as phone numbers, names, addresses, payment screenshots, chat screenshots, and order IDs.

Impact:
Public exposure could violate user privacy and damage platform trust.

Recommended action:
Proof files must be private by default. Only admins and authorized parties should access them through controlled permissions.

---

### KI-0006: Trust score formula not finalized

Status: OPEN  
Severity: MEDIUM

Description:
The trust score concept is defined, but the exact scoring formula is not finalized.

Impact:
Early trust scores may feel arbitrary or unfair if the formula is not transparent.

Recommended action:
Start with a simple deterministic formula and expose reason labels. Add tests for edge cases.

---

### KI-0007: Moderation capacity risk

Status: OPEN  
Severity: MEDIUM

Description:
If the platform grows, manual review of complaints, claims, and risky reviews could become time-consuming.

Impact:
Pending queues may become slow, reducing user and business trust.

Recommended action:
Start with simple moderation tools and add automation gradually.

---

### KI-0008: Search quality may be weak with basic PostgreSQL search

Status: OPEN  
Severity: LOW

Description:
PostgreSQL full-text search is enough for MVP but may not handle typos, Nepali/English mixed text, synonyms, and social seller names well.

Impact:
Users may fail to find businesses.

Recommended action:
Use PostgreSQL search for MVP. Consider Meilisearch or Typesense later.

---

### KI-0009: Nepal-specific localization not yet designed

Status: OPEN  
Severity: LOW

Description:
The app should likely support English first and Nepali later. Exact localization approach is not defined.

Impact:
Could limit adoption among wider Nepali users.

Recommended action:
Keep UI text centralized where possible. Add i18n after MVP if needed.

---

### KI-0011: MVP scope creep risk

Status: OPEN  
Severity: MEDIUM

Description:
The task backlog includes many P0 items across reviews, complaints, claims, admin tools, trust score, search, and file uploads. Building everything at once risks a long pre-launch period.

Impact:
Team may burn time on P2 features or polish before core flows work end-to-end.

Recommended action:
Follow milestone order in `TASKS.md` and phased plan in `PROGRESS.md`. Ship text-only complaints before proof uploads. Defer TD-0304, notifications, and duplicate-merge tooling.

---

### KI-0012: Planning documentation inconsistencies (resolved 2026-05-21)

Status: RESOLVED  
Severity: LOW

Description:
Earlier docs disagreed on route paths (`business/[slug]` vs `businesses/[slug]`), entity lists (ReviewVote/Notification in README but not schema tasks), and helpful votes (TD-0303 vs TD-0304).

Impact:
Agents could implement the wrong routes or block MVP on non-essential schema.

Recommended action:
Canonical public profile route: `/businesses/[slug]`. MVP schema per TD-0102. Helpful votes only in TD-0304.

Related files:
- `README.md`
- `ARCHITECTURE.md`
- `TASKS.md`

---

### KI-0010: Payment and monetization intentionally deferred

Status: ACCEPTED_RISK  
Severity: LOW

Description:
Paid plans, verification payments, and business tools are not part of MVP.

Impact:
No early monetization.

Reason accepted:
Trust and user adoption matter more than monetization at the start.

---

## Resolved issues

- **KI-0001:** Final tech stack confirmed in codebase (2026-05-21)
- **KI-0012:** Planning documentation inconsistencies (2026-05-21)

---

## Issue template

Use this format when adding new issues:

```md
### KI-XXXX: <issue title>

Status: OPEN  
Severity: LOW | MEDIUM | HIGH | CRITICAL

Description:
<What is the issue?>

Impact:
<What could go wrong?>

Recommended action:
<How should it be fixed or handled?>

Related files:
- path/file.ts
```
