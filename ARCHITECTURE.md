# Impresa Viva — Architecture

This describes the target production architecture. Nothing here is implemented yet — see "Implementation phases" for what to build, and in what order.

## Current state

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
- UI components hand-built in shadcn/ui style (Radix primitives + class-variance-authority).
- All data is mock data in `src/lib/mock-data/*`, typed in `src/lib/types.ts`. No backend, no auth, no persistence, no multi-tenant structure yet.
- Mock data is already separated from UI components by design — this is what lets the existing UI be reconnected to real data later without a rewrite.

## Recommended stack

- **Database**: PostgreSQL. Supports row-level security, which is the strongest enforcement layer for multi-tenant isolation.
- **ORM**: Drizzle or Prisma — both work cleanly with Next.js App Router and TypeScript. Pick one at the start of Phase 1 and stay consistent; don't mix. Default recommendation is Drizzle for closer-to-SQL control over tenant-scoped queries, but either is acceptable.
- **Auth**: an auth solution that supports multi-tenant apps and integrates with Next.js App Router (e.g. Auth.js/NextAuth, or a hosted provider such as Clerk). Decide at the start of Phase 2, once the data model from Phase 1 is settled — not before.
- **Hosting**: Vercel (already the implied deploy target of the current Next.js setup).
- **Explicitly excluded**: Firebase — not to be connected per project rules.

## Multi-tenant structure

Every real entity belongs to a `Business` (azienda), not to the app globally:

```
Business (azienda)
 ├─ Membership (user ↔ business, many-to-many, one role per membership)
 │   └─ User
 └─ domain tables, each with a businessId: Cliente, Pagamento, Abbonamento,
     Promemoria, Messaggio, Promozione, Recensione, Preventivo, Stipendio,
     Fornitore, ArticoloMagazzino, ScadenzaAttivita, ...
```

- Each table that today maps to a mock-data file (`clienti`, `pagamenti`, `abbonamenti`, etc.) gets a `businessId` foreign key when it becomes real.
- A user can belong to more than one business (e.g. a collaborator working across two shops, or an external commercialista). The active business is part of the session, not a global assumption.
- All data access must be scoped by `businessId` at the data-access layer (not just filtered in the UI). Postgres row-level security should be the second line of defense behind application-level scoping.

## Roles and permissions

Minimum viable role set for launch:

- **Titolare (owner)**: full access, manages billing, can invite/remove collaborators.
- **Collaboratore (staff)**: day-to-day access to operational sections (Clienti, Pagamenti, Promemoria, Magazzino, etc.), no billing or user management.
- **Commercialista (read-only, optional)**: view-only access to financial sections (IVA e incassi, Commercialista) — matches the existing "Commercialista" section's intent.

Permissions must be enforced server-side (API routes / server actions), not only hidden in the UI — UI-level hiding is a usability nicety, never the security boundary.

## Implementation phases

1. **Data model & database** — design the real schema (Business, User, Membership, one table per current domain entity), set up Postgres + chosen ORM, write migrations. No UI changes in this phase.
2. **Authentication** — real login/signup/session handling, tied to the Business/Membership model from Phase 1.
3. **Roles & permissions** — implement Titolare/Collaboratore/Commercialista enforcement server-side.
4. **Reconnect UI to real data** — replace mock-data imports with real data-fetching, one section at a time, starting with the core sections (Oggi, Clienti, Pagamenti).
5. **Production hardening** — error handling, logging, rate limiting, backups, secrets management, CI checks required before merge.
6. **Later phases** (explicitly deferred — see `PRODUCT.md` "Fasi successive"): billing/subscriptions, real external integrations, advanced reporting, multi-sede.

## Open decisions (to confirm before Phase 1 starts)

- Drizzle vs Prisma.
- Auth provider choice.
- Whether the Commercialista role is needed at launch or can move to a later phase.
