# ARCHITECTURE.md

This document describes the recommended architecture for TrustDoko.

TrustDoko is a Nepal-focused review, complaint, and trust platform for online businesses and local service providers.

---

## Architecture goals

The system must be:

- Trustworthy
- Secure
- Easy to moderate
- SEO-friendly
- Mobile-first
- Maintainable by agentic coding tools
- Simple enough for MVP
- Extensible for future mobile apps and APIs

---

## Recommended system architecture

```txt
Browser / Mobile Web
        |
        v
Next.js App Router
        |
        |-- Public pages
        |-- User dashboard
        |-- Business dashboard
        |-- Admin dashboard
        |
        v
Server Actions / Route Handlers
        |
        |-- Auth checks
        |-- Validation
        |-- Domain services
        |
        v
Domain layer in /lib
        |
        |-- trust-score
        |-- moderation
        |-- search
        |-- storage
        |-- notifications
        |
        v
Prisma ORM
        |
        v
PostgreSQL
```

---

## Recommended stack

```txt
Frontend:       Next.js App Router
Language:       TypeScript
Styling:        Tailwind CSS
Components:     shadcn/ui or custom components
Backend:        Next.js Route Handlers and Server Actions
Database:       PostgreSQL
ORM:            Prisma
Auth:           Auth.js (MVP default)
Storage:        Cloudinary (MVP default)
Search:         PostgreSQL full-text search for MVP
Deployment:     Vercel + Neon/Supabase
Testing:        Vitest/Jest + Playwright later
```

---

## Assumptions (planning defaults)

These defaults apply until implementation proves otherwise. Update this section and `KNOWN-ISSUES.md` when a decision changes.

| Topic | MVP assumption |
|-------|----------------|
| Package manager | pnpm |
| Auth | Auth.js with credentials or OAuth as needed |
| Database | PostgreSQL via Neon (prod) or local Docker (dev) |
| File storage | Cloudinary; proof files private by default |
| UI | Tailwind + shadcn/ui |
| Language | English UI first; Nepali i18n post-MVP |
| Public business URL | `/businesses/[slug]` (plural, consistent everywhere) |
| Review ranking (MVP) | Recency first; helpful votes in TD-0304 |
| Complaint proof (MVP) | Text complaints ship first; file attach after TD-0801 |
| Duplicate businesses | Manual admin handling at launch; merge tooling deferred |
| Notifications | No Notification model yet |
| ReviewVote | In schema; helpful UI in TD-0304 |
| BusinessResponse | Separate table for owner replies to reviews/complaints |
| BusinessVerification | Renamed from VerificationRequest |

Unresolved until TD-0001: exact Auth.js adapter, email provider, and hosting URLs. Track as **KI-0001**.

---

## Main modules

| Module | Location | Responsibility | MVP task refs |
|--------|----------|----------------|---------------|
| Presentation | `app/`, `components/` | Pages, forms, UI states | TD-0202–0204, dashboards |
| API / server | `app/api/`, `app/actions/` | Auth, validation, orchestration | All write flows |
| Permissions | `lib/permissions/` | Role and ownership checks | TD-0104 |
| Trust score | `lib/trust-score/` | Score, label, reasons | TD-0501–0503 |
| Moderation | `lib/moderation/` | Review/complaint status rules | TD-0302, TD-0402 |
| Validations | `lib/validations/` | Zod (or similar) schemas | Per feature tasks |
| Search | `lib/search/` | List/filter query builders | TD-0203 |
| Storage | `lib/storage/` | Upload rules, visibility | TD-0801–0802 |
| Auth | `lib/auth/` | Session helpers | TD-0103 |
| Database | `prisma/`, `lib/db/` | Schema, client, seeds | TD-0101–0102, TD-0201 |

Domain logic must not live in React components. See `AGENTS.md` for agent rules.

---

## Application layers

### 1. Presentation layer

Location:

```txt
app/
components/
```

Responsibilities:

- Render pages
- Render forms
- Render status states
- Trigger server actions or API calls
- Show validation errors
- Keep UI accessible and responsive

Must not contain:

- Trust score formulas
- Authorization rules
- Moderation rules
- Database logic

---

### 2. API/server layer

Location:

```txt
app/api/
app/actions/
```

Responsibilities:

- Authenticate user
- Authorize operation
- Validate input
- Call domain services
- Return safe responses

Rules:

- Never trust client-side role checks.
- Validate all inputs on the server.
- Avoid exposing internal IDs when slugs are better for public pages.
- Return consistent error shapes.

---

### 3. Domain layer

Location:

```txt
lib/
  trust-score/
  moderation/
  validations/
  search/
  storage/
  notifications/
  permissions/
```

Responsibilities:

- Business rules
- Trust score calculation
- Review moderation logic
- Complaint workflow
- File upload rules
- Permission checks

This layer should be easy to unit test.

---

### 4. Data layer

Location:

```txt
prisma/
lib/db/
```

Responsibilities:

- Database schema
- Prisma client
- Migrations
- Seed data
- Query helpers

Rules:

- Use indexes for search and filters.
- Use database enums for stable statuses where appropriate.
- Keep audit history for sensitive actions.

---

## Suggested routes

### Public routes

```txt
/
/businesses
/businesses/[slug]
/categories/[slug]
/write-review/[businessSlug]
/report/[businessSlug]
/trust-score
/about
/contact
```

### Auth routes

```txt
/login
/register
/forgot-password
```

### User dashboard

```txt
/dashboard/user
/dashboard/user/reviews
/dashboard/user/complaints
/dashboard/user/saved
/dashboard/user/settings
```

### Business dashboard

```txt
/dashboard/business
/dashboard/business/[businessId]
/dashboard/business/[businessId]/reviews
/dashboard/business/[businessId]/complaints
/dashboard/business/[businessId]/verification
/dashboard/business/[businessId]/analytics
```

### Admin dashboard

```txt
/dashboard/admin
/dashboard/admin/reviews
/dashboard/admin/complaints
/dashboard/admin/business-claims
/dashboard/admin/verifications
/dashboard/admin/users
/dashboard/admin/audit-logs
```

---

## Core database models

The exact Prisma schema can evolve, but keep these core entities.

### User

```txt
id
name
email
phone
passwordHash or authProviderId
role: USER | BUSINESS | ADMIN
trustLevel: NEW | VERIFIED | TRUSTED | FLAGGED
createdAt
updatedAt
```

### Business

```txt
id
name
slug
description
categoryId
businessType: ONLINE_ONLY | PHYSICAL | HYBRID
address
city
province
phone
email
websiteUrl
facebookUrl
instagramUrl
tiktokUrl
claimedByUserId
claimStatus: UNCLAIMED | PENDING | CLAIMED | REJECTED
verificationStatus: UNVERIFIED | CONTACT_VERIFIED | DOCUMENT_VERIFIED | SOCIAL_VERIFIED
trustScore
averageRating
reviewCount
complaintCount
createdAt
updatedAt
```

### Category

```txt
id
name
slug
description
parentCategoryId
createdAt
updatedAt
```

### Review

```txt
id
businessId
userId
rating: 1..5
title
body
experienceType
experienceDate
status: PENDING | APPROVED | REJECTED | FLAGGED | UNDER_REVIEW
proofFileId
helpfulCount
createdAt
updatedAt
```

Public owner replies live on `BusinessResponse` (linked by `reviewId`), not inline on `Review`.

### Complaint

```txt
id
businessId
userId
category (includes MISLEADING_PRICING, NO_RESPONSE, DUPLICATE_BUSINESS)
summary (auto-truncated from description)
description
experienceDate
amountRange (optional enum)
allowAdminContact
status: SUBMITTED | UNDER_REVIEW | BUSINESS_RESPONDED | RESOLVED | UNRESOLVED | REJECTED
severity: LOW | MEDIUM | HIGH
proofFileId (private; UI placeholder until TD-0802)
adminNote
createdAt
updatedAt
```

Public profile shows aggregate counts only (`total`, `resolved`, `underReview`, `unresolved`) — neutral wording, no scam labels. Proof and admin notes are never exposed on public pages.

Public owner replies live on `BusinessResponse` (linked by `complaintId`).

### BusinessClaim

```txt
id
businessId
userId
method: PHONE | EMAIL | WEBSITE | SOCIAL | DOCUMENT
status: PENDING | APPROVED | REJECTED
adminNote
createdAt
updatedAt
```

### BusinessVerification

```txt
id
businessId
requestedByUserId
type: CONTACT | DOCUMENT | SOCIAL | WEBSITE
status: PENDING | APPROVED | REJECTED
fileId
adminNote
createdAt
updatedAt
```

Renamed from `VerificationRequest` in schema v2. Tracks verification requests per business.

### ReviewVote

```txt
id
reviewId
userId
createdAt
```

One helpful vote per user per review. `Review.helpfulCount` is denormalized for listing performance.

### SavedBusiness

```txt
id
userId
businessId
createdAt
updatedAt
```

User bookmarks for `/dashboard/user/saved`.

### BusinessResponse

```txt
id
businessId
authorUserId
reviewId (optional, unique)
complaintId (optional, unique)
body
createdAt
updatedAt
```

Owner replies to a review or complaint. Exactly one target per row (enforced in application logic).

### FileAsset

```txt
id
ownerUserId
businessId
url
storageKey
mimeType
size
visibility: PRIVATE | PUBLIC
purpose: REVIEW_PROOF | COMPLAINT_PROOF | BUSINESS_DOCUMENT | BUSINESS_IMAGE
createdAt
```

### AuditLog

```txt
id
actorUserId
action
entityType
entityId
metadata
createdAt
```

### Post-MVP entities

**Notification** — in-app or email alerts for owners/admins; not in schema yet.

### Schema implementation notes (2026-05-21 audit)

**Migrations applied (local dev):**

```txt
20260521150137_init
20260521152858_expand_mvp_schema
20260521154323_add_business_type_index
```

**Required MVP models:** All present in `prisma/schema.prisma` — `User`, `Business`, `Category`, `Review`, `Complaint`, `BusinessClaim`, `BusinessVerification` (replaces early `VerificationRequest` naming), `ReviewVote`, `SavedBusiness`, `BusinessResponse`, `FileAsset`, `AuditLog`.

**Relations:** Owner on `Business` via `claimedByUserId` / `BusinessOwner`. One review per user per business (`@@unique([businessId, userId])`). One helpful vote per user per review (`ReviewVote`). Owner replies only on `BusinessResponse` (optional `reviewId` or `complaintId`, each unique when set). Proof files via `FileAsset` with optional `proofFileId` on Review/Complaint.

**Enums:** PascalCase model enums with SCREAMING_SNAKE values (e.g. `ClaimStatus.UNCLAIMED`, `ComplaintCategory.NON_DELIVERY`). Separate enums for business-level `VerificationStatus` vs per-request `BusinessVerificationStatus`.

**Indexes (search and listing):** `Business` — `slug`, `name`, `city`, `province`, `categoryId`, `trustScore`, `averageRating`, `claimStatus`, `verificationStatus`, `businessType`, composite `(city, categoryId)`. Name/slug search uses `ILIKE` in app code (no PostgreSQL full-text index yet). `Category` — `slug`, `name`. `Review` / `Complaint` — status and business-scoped composites for profile and moderation queries.

**Timestamps:** `createdAt` / `updatedAt` on all mutable domain models. Append-only or immutable rows: `ReviewVote` (`createdAt` only), `FileAsset` (`createdAt` only), `AuditLog` (`createdAt` only).

**Not enforced in the database (application layer):**

- `BusinessResponse`: exactly one of `reviewId` or `complaintId` must be set.
- `Review.rating` in range 1–5.
- `Business.trustScore`, `averageRating`, `reviewCount`, `complaintCount` kept denormalized; must be updated in transactions when reviews/complaints change (TD-0501 / moderation tasks).

**Seed:** `prisma/seed.ts` — idempotent upserts for 10 categories, 12 `[Sample]` businesses, one sample reviewer, 2 approved reviews.

**Tooling:** `npm run db:format`, `db:validate`, `db:generate`, `db:migrate`, `db:seed`, `db:status`, `db:reset`, `db:migrate:deploy`, `db:studio`. See `README.md` § Database troubleshooting.

---

## Review workflow

MVP implementation (`lib/moderation/review-status.ts`):

```txt
User submits review (logged in, one per business)
        |
        v
Validate input (Zod) + rate limit (10 min between new reviews)
        |
        v
Scan title + body for risky phrases (scam, fraud, fake, harassment, abuse)
        |
        +-- match --> status PENDING (hidden from public list; author sees banner)
        |
        +-- no match --> status APPROVED (public immediately)
        |
        v
Recalculate Business.reviewCount and Business.averageRating (approved only)
        |
        v
Trust score formula unchanged until TD-0501
```

Helpful votes: `ReviewVote` (one per user per review) increments `Review.helpfulCount`.

Proof upload: UI placeholder only until TD-0801.

Risky reviews include serious accusations or suspicious patterns.

---

## Complaint workflow

```txt
User submits complaint
        |
        v
Complaint status = SUBMITTED
        |
        v
Admin reviews severity
        |
        +-- invalid --> REJECTED
        +-- valid --> UNDER_REVIEW
        |
        v
Business gets response opportunity
        |
        v
Status can become BUSINESS_RESPONDED, RESOLVED, or UNRESOLVED
        |
        v
Trust score updates based on status and severity
```

---

## Business claim workflow

```txt
Business owner requests claim
        |
        v
Select verification method
        |
        v
Submit proof or OTP/domain/social validation
        |
        v
Admin reviews
        |
        +-- approve --> business claimed
        +-- reject --> claim rejected with note
        |
        v
Audit log created
```

---

## Trust score architecture

Location:

```txt
lib/trust-score/
```

Recommended files:

```txt
lib/trust-score/calculateTrustScore.ts
lib/trust-score/types.ts
lib/trust-score/labels.ts
lib/trust-score/constants.ts
lib/trust-score/__tests__/calculateTrustScore.test.ts
```

Trust score must be deterministic and testable.

Example inputs:

```txt
verificationStatus
reviewCount
averageRating
recentReviewTrend
complaintCount
unresolvedComplaintCount
highSeverityComplaintCount
businessResponseRate
accountAgeDays
suspiciousReviewSignalCount
```

Example output:

```txt
score: 0..100
label: HIGHLY_TRUSTED | TRUSTED | MIXED | RISKY | HIGH_RISK | UNDER_REVIEW
reasons: string[]
```

Never hide the basic reasoning. Users should understand why a business has a label.

---

## Authorization matrix

| Action | User | Business Owner | Admin |
|---|---:|---:|---:|
| View public business | Yes | Yes | Yes |
| Submit review | Yes | Yes | Yes |
| Edit own review | Yes | Yes | Yes |
| Delete own review | Yes | Yes | Yes |
| Reply to review | No | Own business only | Yes |
| Submit complaint | Yes | Yes | Yes |
| Respond to complaint | No | Own business only | Yes |
| Claim business | Yes | Yes | Yes |
| Approve claim | No | No | Yes |
| Moderate review | No | No | Yes |
| Moderate complaint | No | No | Yes |
| Edit business profile | No | Own claimed business only | Yes |
| View private proof | Own proof only | Related complaint if allowed | Yes |

---

## Search architecture

MVP:

- PostgreSQL full-text search
- Search by business name, category, city, province, description, and social links
- Filters by category, city, rating, trust score, verification status, and business type

Future:

- Meilisearch or Typesense
- Typo tolerance
- Synonyms for Nepali/English terms
- Popular searches
- Search analytics

---

## File upload architecture

Proof files are sensitive.

Default visibility:

```txt
PRIVATE
```

Allowed public files:

- Business logo
- Business gallery image
- Public profile image

Private files:

- Complaint proof
- Review proof
- Business documents
- PAN/VAT documents
- Screenshots containing personal data

Rules:

- Validate MIME type.
- Limit file size.
- Store metadata in database.
- Do not expose direct private URLs publicly.
- Use signed URLs for private access if supported.

---

## Security architecture

Minimum security requirements:

- Server-side authorization checks
- Password hashing if managing passwords directly
- CSRF protection if needed by auth approach
- Rate limiting for review, complaint, login, and claim endpoints
- Input validation with Zod or similar
- File type and file size validation
- Admin route protection
- Audit logs for admin actions
- No public exposure of private proof files
- No secrets committed to git

---

## SEO architecture

TrustDoko needs public search traffic.

SEO pages:

- Business profile pages
- Category pages
- City pages
- Trusted businesses pages
- Consumer safety blog posts

Important metadata:

- Title
- Description
- Open Graph image
- Canonical URL
- Structured data later

Do not expose private complaint proof or user private data in SEO pages.

---

## Performance requirements

MVP targets:

- Public business pages should load quickly.
- Search should respond within acceptable time for small-to-medium data.
- Use pagination for reviews and search results.
- Avoid loading all reviews at once.
- Cache stable public data where safe.

Database indexes to consider:

```txt
Business.slug
Business.name
Business.city
Business.categoryId
Business.trustScore
Review.businessId
Review.userId
Review.status
Complaint.businessId
Complaint.status
BusinessClaim.status
```

---

## Future architecture options

Only add these when needed:

- Mobile app with React Native
- Dedicated API service
- Meilisearch/Typesense
- Notification service
- Background jobs for trust score recalculation
- ML-based review spam detection
- Public TrustDoko badge widget
- Browser extension for checking sellers on Facebook/Instagram
