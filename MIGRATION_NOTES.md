# Yeshwa Modular Furniture — Migration Notes

Converting the original HTML/CSS export (DartCanvas `.dc.html` files) into a modern
Vite + React + TypeScript application, then layering in dynamic admin/Supabase/R2.

## 1. Original files & backup

All original files are preserved untouched in **`legacy-static/`** (do not delete).
They are also still present at the project root for reference during migration.

| Original file                 | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `Yeshwa-Home.dc.html`         | Home page (hero, marquee, stats, etc.)   |
| `Yeshwa-About.dc.html`        | About page                               |
| `Yeshwa-Products.dc.html`     | Products / projects grid                 |
| `Yeshwa-Gallery.dc.html`      | Masonry gallery                          |
| `Yeshwa-Blog.dc.html`         | Blog index                               |
| `Yeshwa-Contact.dc.html`      | Contact + enquiry form                   |
| `Yeshwa-Admin.dc.html`        | Admin content editor (reference design)  |
| `Yeshwa-Analytics.dc.html`    | Admin analytics (reference design)       |
| `Yeshwa-Enquiries.dc.html`    | Admin enquiries table (reference design) |
| `YeshwaNav.dc.html`           | Shared public navbar                     |
| `YeshwaFooter.dc.html`        | Shared public footer                     |
| `YeshwaAdminSidebar.dc.html`  | Shared admin sidebar                     |
| `support.js`                  | DartCanvas runtime (not migrated)        |
| `uploads/Yeshwa-logo.jpeg`    | Brand logo                               |

The original markup uses a custom runtime: `<x-dc>`, `<dc-import>`, `<sc-if>`,
`<sc-for>`, `{{ moustache }}` bindings and `class Component extends DCLogic`.
None of that runtime is carried over — behaviour is reimplemented idiomatically in React.

## 2. File → React component map

### Public
| Original                    | React                                         |
| --------------------------- | --------------------------------------------- |
| `YeshwaNav.dc.html`         | `src/components/public/Navbar.tsx`            |
| `YeshwaFooter.dc.html`      | `src/components/public/Footer.tsx`            |
| `Yeshwa-Home.dc.html`       | `src/pages/public/HomePage.tsx`               |
| `Yeshwa-About.dc.html`      | `src/pages/public/AboutPage.tsx`              |
| `Yeshwa-Products.dc.html`   | `src/pages/public/ProductsPage.tsx`           |
| `Yeshwa-Gallery.dc.html`    | `src/pages/public/GalleryPage.tsx`            |
| `Yeshwa-Blog.dc.html`       | `src/pages/public/BlogPage.tsx` + `BlogDetailPage.tsx` |
| `Yeshwa-Contact.dc.html`    | `src/pages/public/ContactPage.tsx`            |

### Admin
| Original                     | React                                          |
| ---------------------------- | ---------------------------------------------- |
| `YeshwaAdminSidebar.dc.html` | `src/components/admin/AdminSidebar.tsx`        |
| `Yeshwa-Admin.dc.html`       | `src/pages/admin/AdminDashboardPage.tsx` / `AdminPagesPage.tsx` |
| `Yeshwa-Enquiries.dc.html`   | `src/pages/admin/AdminEnquiriesPage.tsx`       |
| `Yeshwa-Analytics.dc.html`   | `src/pages/admin/AdminDashboardPage.tsx` (KPIs) |

## 3. Brand tokens (extracted, must be preserved)

| Token              | Value     | Usage                                  |
| ------------------ | --------- | -------------------------------------- |
| Cream background   | `#F7F0E6` | Public page background, light text     |
| Cream (admin)      | `#F1EADC` | Admin background                       |
| Orange accent      | `#D9824A` | Primary CTA, accents, links            |
| Orange hover       | `#C26E38` | CTA hover                              |
| Orange light       | `#E5915A` | Footer/dark-section accent             |
| Deep navy          | `#21353F` | Footer background                      |
| Ink (near-black)   | `#16242B` | Headings, dark sections                |
| Text navy/slate    | `#2D4654` | Body text, secondary buttons           |
| Muted slate        | `#5E6E76` | Paragraph text                         |
| Warm grey          | `#8a7a66` / `#9a8b76` | Eyebrow / meta labels       |
| Panel cream        | `#EFE6D8` | Alt section background                 |
| Card white         | `#ffffff` | Cards                                  |

Fonts (Google Fonts):
- **Newsreader** (serif) — headings/display. Weights 200–600, italic supported.
- **Hanken Grotesk** (sans) — body/UI. Weights 400/500/600/700.

Signature motion: `yreveal` scroll reveal (view-timeline + IO fallback),
`yzoom` image hover zoom, `ymarquee` city marquee, animated stat counters,
custom cursor follower + magnetic buttons (pointer-fine only).
All gated behind `prefers-reduced-motion`.

## 4. Migration strategy

1. Page layouts are ported as JSX with inline `style` objects to guarantee
   pixel-for-pixel fidelity with the original inline-styled markup (rule #1).
2. Shared chrome (Navbar/Footer/WhatsApp) lives in `PublicLayout` — not copied per page.
3. Brand tokens are centralised in `src/styles/tokens.css` + `tailwind.config.js`
   so future work can migrate toward utility classes without changing the look.
4. Static migration is completed and visually verified before dynamic features
   are wired in. Placeholder image slots from the original are preserved.

## 5. Status
- [x] Phase 1 — backup + analysis
- [x] Phase 2 — static React migration (all public pages, visually verified)
- [x] Phase 3 — animation layer (reveal, counters, marquee, magnetic cursor, reduced-motion)
- [x] Phase 4 — Supabase data model (schema + RLS + seed)
- [x] Phase 5 — admin panel (dashboard, pages, blog+TipTap, gallery, projects, enquiries, media, settings, health)
- [x] Phases 6–8 — Pages Functions (upload-url, enquiry, system-health) + Google map/reviews/business CTAs
- [x] Phases 9–12 — SEO helper, .env.example, DEPLOYMENT.md, code-splitting, green build

## 6. What needs credentials to fully activate
The site runs and looks identical without a backend (static seed fallback). To
enable dynamic features, set the env vars in `.env` / Cloudflare Pages:
- **Supabase** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
  → admin login, content CRUD, enquiry storage, page live/off control.
- **R2** (`R2_BUCKET` binding + `R2_PUBLIC_BASE_URL`) → image uploads.
- **Webhook** (`MAKE_OR_N8N_WEBHOOK_URL`) → enquiry notifications (optional).
See `DEPLOYMENT.md` for the full setup.
