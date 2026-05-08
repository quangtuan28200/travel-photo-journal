# AGENTS.md

Project instructions for Codex and other coding agents working in this repo.

## Project Overview

This is `travel-photo-journal`, a private Next.js app for a public travel photo gallery and an admin upload workflow.

Core stack:

- Next.js 15 App Router with React 19 and TypeScript
- Supabase for auth and database access
- Cloudflare R2 for object storage and public image delivery
- Sharp for server-side image processing
- Tailwind CSS for styling
- Vitest and Testing Library for tests

## Common Commands

Use Yarn for this project.

```bash
yarn install
yarn dev
yarn lint
yarn test
yarn test:coverage
yarn build
```

## Environment

Copy `.env.example` to `.env.local` for local development.

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`

Keep `SUPABASE_SERVICE_ROLE_KEY` and all R2 credentials server-side only. Do not expose secrets through `NEXT_PUBLIC_` variables, client components, logs, test snapshots, or error messages.

## Code Guidelines

- Follow existing file organization under `src/app`, `src/components`, and `src/lib`.
- Prefer small, focused modules and pure helpers in `src/lib`.
- Validate external input at server boundaries with the existing validation patterns.
- Preserve immutable data updates. Avoid mutating arrays or objects in place.
- Keep UI consistent with the existing quiet gallery/admin interface.
- Use existing Supabase helpers in `src/lib/supabase` rather than creating parallel clients.
- Use existing R2 and image helpers for upload, key generation, and image variants.

## Testing Expectations

For behavior changes, add or update focused tests near the affected code.

- Utility and validation logic: Vitest unit tests in `src/lib/*.test.ts`
- Components: Testing Library tests in `src/components/*.test.tsx`
- Critical auth, upload, or admin flows: add integration or E2E coverage when practical

Before handing off substantial changes, run:

```bash
yarn lint
yarn test
yarn build
```

If a command cannot run because dependencies or environment variables are missing, report that clearly.

## Security Notes

- Treat admin routes, uploads, image processing, and storage keys as security-sensitive.
- Never trust client-provided file names, MIME types, slugs, or IDs without validation.
- Do not leak service-role, R2, or session details in client-rendered errors.
- Keep Supabase service-role usage restricted to server-only code.
- For storage paths, use the existing R2 key helpers to avoid path traversal or inconsistent object naming.

## Database

Supabase migrations live in `supabase/migrations`. Add new schema changes as migrations rather than modifying applied migrations unless the user explicitly requests a rewrite.

## Git Hygiene

- Do not revert unrelated user changes.
- Keep diffs scoped to the requested task.
- Use conventional commit messages when asked to commit.
