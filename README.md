# Travel Photo Journal

A personal travel photo gallery built with Next.js, Supabase, and Cloudflare R2.

## Features

- Public trip album gallery at `/`
- Trip detail pages at `/trips/[slug]`
- Admin login with Supabase magic links at `/admin/login`
- Admin CRUD for trips and photo uploads
- Server-side image processing with Sharp into original, large, and thumbnail WebP variants
- Cloudflare R2 object storage with public image delivery

## Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Configure Supabase and R2 values in `.env.local`.

4. Apply the Supabase migration in `supabase/migrations`.

5. Run the app:

   ```bash
   yarn dev
   ```

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`

Keep service role and R2 credentials server-side only. Never expose them with `NEXT_PUBLIC_`.
