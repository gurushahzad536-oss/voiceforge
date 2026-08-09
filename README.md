# VoiceForge — Frontend

Next.js + Tailwind + Supabase Auth frontend for the voice cloning product.

## Pages
- `/` — landing page
- `/login`, `/signup` — Supabase email/password auth
- `/clone` — upload or record (real mic recording) a sample, name + language, submit (requires login)
- `/generate` — pick a clone, write a script, pick a language, get audio back (requires login)
- `/dashboard` — your own clones only, per-user (requires login)
- `/pricing` — trial + 3 plans (Monthly / 6 Months / Yearly) with discount math
- Custom 404 page for any unknown route

## Run it
```bash
npm install
npm run dev
```

## Environment variables
Copy `.env.local.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_API_URL` — your backend's public URL (ngrok/Colab or a real host)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase **publishable** key (safe for the browser)

Never put the Supabase **secret** key or **JWT secret** in this frontend — those
belong only in the backend (Colab notebook / server env vars).

## How auth works
- The frontend uses Supabase Auth directly (signup/login/logout).
- Every request to `/clone`, `/generate`, and `/voices` sends the user's
  Supabase access token as `Authorization: Bearer <token>`.
- The backend verifies that token and only ever reads/writes that user's own
  rows — see the backend code for details.

## Known limitations (next steps)
- Payments aren't wired up — `/pricing` buttons just go to signup. Connect
  Stripe/JazzCash/EasyPaisa to actually charge.
- Non-English/Mandarin generation quality depends on the backend model
  checkpoint — the base F5-TTS model is strongest in English & Mandarin.
- "Generations this month" isn't tracked yet — would need a `generations`
  table in Supabase, similar to the `voices` table.
