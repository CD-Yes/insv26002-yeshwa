# Deployment — Yeshwa Modular Furniture

Stack: **Cloudflare Pages** (frontend) + **Cloudflare Pages Functions** (API) +
**Supabase** (auth/database) + **Cloudflare R2** (media). Optional Make.com/n8n webhook.

> Do **not** deploy to Vercel — this project is built for Cloudflare Pages.

---

## 1. Prerequisites

- A Supabase project (free tier is fine).
- A Cloudflare account with Pages + R2 enabled.
- This repo pushed to GitHub/GitLab (for Pages CI) — or use `wrangler pages deploy dist`.

---

## 2. Supabase setup

1. Create a project at supabase.com. Note the **Project URL**, **anon key**, and **service_role key** (Settings → API).
2. Open the SQL editor and run, in order:
   1. `supabase/schema.sql`
   2. `supabase/policies.sql`
   3. `supabase/seed.sql`
3. Create the admin user: **Authentication → Users → Add user** (email + password).
4. Promote them to admin (SQL editor):
   ```sql
   update public.profiles set role = 'admin' where email = 'you@yourdomain.com';
   ```
   (A `profiles` row is auto-created by trigger on signup.)

---

## 3. Cloudflare R2 setup

1. **R2 → Create bucket**, e.g. `yeshwa-media`.
2. Enable public access: attach a custom domain or use the r2.dev public URL.
   Note the **public base URL** (e.g. `https://media.yeshwa.studio` or the r2.dev URL).
3. In **Pages → your project → Settings → Functions → R2 bindings**, add a binding:
   - Variable name: `R2_BUCKET`
   - Bucket: `yeshwa-media`

The upload Function uses the `R2_BUCKET` binding directly — no S3 keys required at
runtime. (The S3-style `R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY` vars in `.env.example`
are only needed if you later script uploads outside Pages.)

---

## 4. Cloudflare Pages setup

**Create project** → connect the Git repo (or direct upload).

Build settings:

| Setting             | Value           |
| ------------------- | --------------- |
| Framework preset    | None / Vite     |
| Build command       | `npm run build` |
| Build output dir    | `dist`          |
| Node version        | 20 (or 22)      |

### Environment variables (Pages → Settings → Environment variables)

**Production + Preview — browser (safe to expose):**
```
VITE_SUPABASE_URL        = https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY   = <anon key>
VITE_SITE_URL            = https://yeshwa.studio
VITE_WHATSAPP_NUMBER     = <digits, e.g. 919000000000>
```

**Server-only (used by Functions — NEVER prefixed with VITE_):**
```
SUPABASE_URL              = https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY = <service_role key>   ← secret, encrypt it
R2_PUBLIC_BASE_URL        = https://media.yeshwa.studio
MAKE_OR_N8N_WEBHOOK_URL   = <optional webhook URL>
```

`R2_BUCKET` is provided by the **binding** (step 3), not as a text var.

> Mark `SUPABASE_SERVICE_ROLE_KEY` (and the webhook URL) as **encrypted** secrets.
> The service role key must never be exposed to the browser.

---

## 5. Deploy

- **Git-connected:** push to the production branch → Pages builds automatically.
- **Manual:** `npm run build && npx wrangler pages deploy dist`.

The SPA fallback (`public/_redirects`) routes client-side paths to `index.html`,
while `/api/*` is served by the Functions in `functions/`.

---

## 6. Custom domain

Pages → **Custom domains** → add `yeshwa.studio` (and `www`). Cloudflare provisions
the certificate automatically. Update `VITE_SITE_URL` to the final domain and redeploy
so canonical/OG URLs are correct.

---

## 7. Post-deploy checks

- [ ] Public pages load (`/`, `/about`, `/products`, `/gallery`, `/blog`, `/contact`).
- [ ] Admin login works at `/admin/login`; dashboard loads after sign-in.
- [ ] Toggling a page off in **Admin → Pages** shows the "unavailable" screen publicly.
- [ ] Contact form submits → row appears in **Admin → Enquiries**.
- [ ] Image upload in Gallery/Blog stores to R2 and shows in Media library.
- [ ] **Admin → System health** shows Supabase ✓ and R2 ✓.

---

## 8. Rollback

- **Pages:** Deployments tab → pick a previous successful deployment → **Rollback**.
- **Database:** schema/seed files are idempotent; restore from a Supabase backup
  (Database → Backups) if data must be reverted.
- **R2:** objects are immutable keys; deleting a `media_assets` row does not delete the
  R2 object (intentional — avoids breaking referenced content).

---

## 9. Local development

```
cp .env.example .env      # fill VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm install
npm run dev               # http://localhost:5173
```

To test Functions + R2 locally, run with Wrangler:
```
npm run build
npx wrangler pages dev dist --r2 R2_BUCKET=yeshwa-media
```
Without Supabase env the site still renders using static seed data; the contact
form and admin login degrade gracefully.
