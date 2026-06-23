-- ===========================================================================
-- Seed data — mirrors src/data/staticSeed.ts so the DB matches the static site.
-- Idempotent: uses ON CONFLICT so it can be re-run safely.
-- Run after schema.sql + policies.sql.
-- ===========================================================================

-- --- pages (live/off control) -----------------------------------------------
insert into public.pages (slug, title, is_published) values
  ('home',     'Home',                 true),
  ('about',    'About',                true),
  ('products', 'Products / Projects',  true),
  ('gallery',  'Gallery',              true),
  ('blog',     'Blog',                 true),
  ('contact',  'Contact',              true)
on conflict (slug) do nothing;

-- --- site_settings ----------------------------------------------------------
insert into public.site_settings (key, value) values
  ('email',                 'hello@yeshwa.studio'),
  ('phone',                 '+1 000 000 0000'),
  ('phone_raw',             '+10000000000'),
  ('whatsapp',              '10000000000'),
  ('address',               'Yeshwa Experience Studio · Visit by appointment'),
  ('business_hours',        'Open 7 days · 10am–8pm'),
  ('google_maps_embed_url', 'https://www.google.com/maps?q=design+studio&output=embed'),
  ('google_reviews_url',    'https://www.google.com/maps?q=design+studio'),
  ('social_linkedin',       '#'),
  ('social_instagram',      '#'),
  ('social_facebook',       '#')
on conflict (key) do nothing;

-- --- projects ---------------------------------------------------------------
insert into public.projects (title, slug, category, location, is_featured, is_published) values
  ('Matte-laminate L-kitchen',  'matte-laminate-l-kitchen',  'Kitchen',      'The Lakeside Residence · London',     true,  true),
  ('3-door sliding wardrobe',   '3-door-sliding-wardrobe',   'Wardrobe',     'The Hillside Apartment · Dubai',      false, true),
  ('Floating media wall',       'floating-media-wall',       'TV & storage', 'The Garden Loft · New York',          false, true),
  ('Study + shelving nook',     'study-shelving-nook',       'Home office',  'The Quayside Flat · Singapore',       false, true),
  ('Island kitchen in oak',     'island-kitchen-in-oak',     'Kitchen',      'The Parkview House · Sydney',         false, true),
  ('Complete home interiors',   'complete-home-interiors',   'Full-home',    'The Waterford Townhouse · Toronto',   false, true)
on conflict (slug) do nothing;

-- --- gallery_items ----------------------------------------------------------
insert into public.gallery_items (title, slug, category, sort_order, is_published) values
  ('Kitchen — London',    'kitchen-london',     'Kitchens',     0, true),
  ('Wardrobe — Dubai',    'wardrobe-dubai',     'Wardrobes',    1, true),
  ('Living room',         'living-room',        'Living rooms', 2, true),
  ('Island kitchen',      'island-kitchen',     'Kitchens',     3, true),
  ('Walk-in wardrobe',    'walk-in-wardrobe',   'Wardrobes',    4, true),
  ('Media wall',          'media-wall',         'Living rooms', 5, true),
  ('Bedroom storage',     'bedroom-storage',    'Bedrooms',     6, true),
  ('Study nook',          'study-nook',         'Living rooms', 7, true),
  ('Full-home — Sydney',  'full-home-sydney',   'Kitchens',     8, true)
on conflict (slug) do nothing;

-- --- blog_posts -------------------------------------------------------------
insert into public.blog_posts (title, slug, category, excerpt, content_html, author, status, published_at) values
  ('The modular kitchen budget guide: where to spend and where to save',
   'the-modular-kitchen-budget-guide-where-to-spend-and-where-to', 'Kitchens',
   'A clear breakdown of what actually drives kitchen cost — carcass material, hardware, finishes and countertops — so you can build smart without overspending.',
   '<p>A clear breakdown of what actually drives kitchen cost — carcass material, hardware, finishes and countertops — so you can build smart without overspending.</p>',
   'Yeshwa Studio', 'published', now()),
  ('7 layout mistakes that make a kitchen feel cramped',
   '7-layout-mistakes-that-make-a-kitchen-feel-cramped', 'Kitchens',
   'Common planning errors and how to avoid them.',
   '<p>Common planning errors and how to avoid them.</p>',
   'Yeshwa Studio', 'published', now()),
  ('Plywood vs MDF vs particle board: what actually lasts',
   'plywood-vs-mdf-vs-particle-board-what-actually-lasts', 'Materials',
   'A practical look at carcass materials.',
   '<p>A practical look at carcass materials.</p>',
   'Yeshwa Studio', 'published', now()),
  ('Small-home storage: 12 ideas that reclaim space',
   'small-home-storage-12-ideas-that-reclaim-space', 'Storage',
   'Clever storage for compact homes.',
   '<p>Clever storage for compact homes.</p>',
   'Yeshwa Studio', 'published', now()),
  ('How to keep laminate shutters looking new for years',
   'how-to-keep-laminate-shutters-looking-new-for-years', 'Care & maintenance',
   'Simple maintenance that pays off.',
   '<p>Simple maintenance that pays off.</p>',
   'Yeshwa Studio', 'published', now()),
  ('Sliding vs hinged wardrobes: which is right for your room',
   'sliding-vs-hinged-wardrobes-which-is-right-for-your-room', 'Wardrobes',
   'Choosing the right wardrobe type.',
   '<p>Choosing the right wardrobe type.</p>',
   'Yeshwa Studio', 'published', now()),
  ('Lighting your modular kitchen: a simple 3-layer approach',
   'lighting-your-modular-kitchen-a-simple-3-layer-approach', 'Kitchens',
   'Task, ambient and accent lighting.',
   '<p>Task, ambient and accent lighting.</p>',
   'Yeshwa Studio', 'published', now())
on conflict (slug) do nothing;

-- --- sample enquiries (optional demo data for the admin table) ---------------
insert into public.enquiries (name, phone, email, location, requirement_type, budget_range, message, status) values
  ('Olivia Bennett', '+44 7700 900001', 'olivia.b@email.com', 'London',    'Modular Kitchen',  '$10k–25k', 'Renovating our flat — handle-less island kitchen in oak. Start in August.', 'new'),
  ('Marcus Chen',    '+65 8000 0002',   'm.chen@email.com',   'Singapore', 'Custom Furniture', '$25k +',   '4-bedroom condo, need the entire home fitted out.', 'new'),
  ('Aisha Rahman',   '+971 50 000 0003','aisha.r@email.com',  'Dubai',     'Wardrobe',         '$5k–10k',  'Glass-front walk-in wardrobe with integrated lighting.', 'contacted')
on conflict do nothing;

-- ===========================================================================
-- Admin user: create the auth user in the Supabase dashboard (Authentication →
-- Add user), then promote to admin:
--
--   update public.profiles set role = 'admin' where email = 'you@yourdomain.com';
-- ===========================================================================
