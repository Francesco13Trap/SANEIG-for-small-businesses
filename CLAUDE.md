@AGENTS.md

# Impresa Viva

Gestionale semplice per piccoli business italiani.

This is a real product being built for sale to real Italian small businesses — not a demo. See `PRODUCT.md` for positioning/scope and `ARCHITECTURE.md` for the technical foundation and build phases.

## Project rules

- Product name is **Impresa Viva**. Never use prior project names (LocalFlow, Saneig, SANEIG, or any other old name) in code, copy, commits, branches, or docs going forward.
- All user-facing text is in Italian, in plain non-technical language (see `PRODUCT.md` for vocabulary rules).
- Treat every change as production work: no throwaway shortcuts that would need to be redone later.
- Don't add features, refactor, or expand scope beyond what's explicitly asked for in a given step.

## Working method

- Move fast and freely on safe, reversible work: UI, copy, presentation components, mock data.
- Move carefully and incrementally on foundational work: authentication, database schema, multi-tenant structure, roles/permissions, production deployment. Get these reviewed before building further on top of them.
- Use a GitHub branch + PR workflow. Do not merge automatically — merging is a human decision.
- Do not connect Firebase or any other backend service without explicit instruction.
- Keep mock data and UI presentation separate from real data access (already the case in `src/lib/mock-data/*`), so existing UI can be reconnected to real data section by section.
- Always summarize work in plain, non-technical Italian at the end of a response ("riassunto per chat").

## Long-term roadmap

1. Foundation docs (this step) — `CLAUDE.md`, `PRODUCT.md`, `ARCHITECTURE.md`.
2. Real data model + database, multi-tenant from the start (`ARCHITECTURE.md` Phase 1).
3. Real authentication tied to the tenant model (Phase 2).
4. Roles and permissions enforced server-side (Phase 3).
5. Reconnect existing UI sections to real data, one section at a time, starting with the core sections (Phase 4).
6. Production hardening: error handling, logging, backups, secrets management, CI gates before merge (Phase 5).
7. Later phases (billing, integrations, advanced reporting, multi-sede): see `PRODUCT.md` "Fasi successive" — explicitly deferred, not started until asked.
