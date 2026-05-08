# Repository Guidelines

## Project Structure & Module Organization

This is a private Next.js 15 App Router project for a public travel photo gallery and admin upload workflow. Application routes and server actions live in `src/app`. Shared UI belongs in `src/components`, and reusable helpers for auth, validation, Supabase, R2, redirects, slugs, and API behavior belong in `src/lib`. Supabase schema changes live in `supabase/migrations`; add new migration files instead of editing applied ones. Tests are colocated near the code they cover, such as `src/lib/validation.test.ts` and `src/components/lightbox.test.tsx`.

## Build, Test, and Development Commands

Use Yarn for all project commands.

- `yarn install`: install dependencies from `yarn.lock`.
- `yarn dev`: start the local Next.js development server.
- `yarn lint`: run ESLint across the repository.
- `yarn test`: run the Vitest suite once.
- `yarn test:watch`: run Vitest in watch mode.
- `yarn test:coverage`: run tests with V8 coverage.
- `yarn build`: create a production Next.js build.

## Coding Style & Naming Conventions

Use TypeScript, React 19, and Tailwind CSS. Follow the existing module style: small focused files, pure helpers in `src/lib`, and component names in PascalCase. Use kebab-case or descriptive lowercase filenames where the repository already does so, for example `lightbox.test.tsx` and `next.config.ts`. Keep server-only logic, service-role Supabase access, Sharp processing, and R2 credentials out of client components. Prefer existing helpers in `src/lib/supabase`, R2 utilities, and validation modules over parallel implementations.

## Testing Guidelines

Vitest and Testing Library are the primary test tools, configured through `vitest.config.ts` and `vitest.setup.ts`. Name tests with `.test.ts` or `.test.tsx` and place them beside the affected module. Add focused unit tests for validation, config, storage, and auth helpers. Add component tests for interactive UI behavior. For substantial changes, run `yarn lint`, `yarn test`, and `yarn build` before handoff.

## Commit & Pull Request Guidelines

Recent commits use conventional commit style, especially `fix: ...` messages such as `fix: avoid client env reads for admin photos`. Keep commits scoped to one logical change. Pull requests should include a concise description, testing performed, linked issues when applicable, and screenshots for visible gallery or admin UI changes.

## Security & Configuration Tips

Copy `.env.example` to `.env.local` for development. Required secrets include Supabase service-role and Cloudflare R2 credentials; never expose them through `NEXT_PUBLIC_` variables, client-rendered errors, logs, or snapshots. Validate client-provided file names, MIME types, slugs, IDs, and upload input at server boundaries.
