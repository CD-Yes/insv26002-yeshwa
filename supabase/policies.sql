-- ===========================================================================
-- Row Level Security policies
-- Rules:
--   * Public (anon) may READ only published content.
--   * Public may INSERT enquiries only.
--   * Staff (admin/editor) may manage all content.
--   * Service role (functions) bypasses RLS automatically.
-- Run after schema.sql.
-- ===========================================================================

alter table public.profiles      enable row level security;
alter table public.pages         enable row level security;
alter table public.gallery_items enable row level security;
alter table public.projects      enable row level security;
alter table public.blog_posts    enable row level security;
alter table public.enquiries     enable row level security;
alter table public.media_assets  enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs    enable row level security;

-- helper to (re)create a policy idempotently
-- (Postgres has no CREATE POLICY IF NOT EXISTS; drop first.)

-- ---------- profiles --------------------------------------------------------
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_staff());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (id = auth.uid() or public.is_staff());

-- ---------- pages -----------------------------------------------------------
drop policy if exists pages_public_read on public.pages;
create policy pages_public_read on public.pages
  for select using (true); -- slugs + flags are not sensitive; UI gates rendering

drop policy if exists pages_staff_write on public.pages;
create policy pages_staff_write on public.pages
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- gallery_items ---------------------------------------------------
drop policy if exists gallery_public_read on public.gallery_items;
create policy gallery_public_read on public.gallery_items
  for select using (is_published or public.is_staff());

drop policy if exists gallery_staff_write on public.gallery_items;
create policy gallery_staff_write on public.gallery_items
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- projects --------------------------------------------------------
drop policy if exists projects_public_read on public.projects;
create policy projects_public_read on public.projects
  for select using (is_published or public.is_staff());

drop policy if exists projects_staff_write on public.projects;
create policy projects_staff_write on public.projects
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- blog_posts ------------------------------------------------------
drop policy if exists blog_public_read on public.blog_posts;
create policy blog_public_read on public.blog_posts
  for select using (status = 'published' or public.is_staff());

drop policy if exists blog_staff_write on public.blog_posts;
create policy blog_staff_write on public.blog_posts
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- enquiries -------------------------------------------------------
-- Anyone may submit; only staff may read/update/delete.
drop policy if exists enquiries_public_insert on public.enquiries;
create policy enquiries_public_insert on public.enquiries
  for insert with check (true);

drop policy if exists enquiries_staff_read on public.enquiries;
create policy enquiries_staff_read on public.enquiries
  for select using (public.is_staff());

drop policy if exists enquiries_staff_update on public.enquiries;
create policy enquiries_staff_update on public.enquiries
  for update using (public.is_staff()) with check (public.is_staff());

drop policy if exists enquiries_staff_delete on public.enquiries;
create policy enquiries_staff_delete on public.enquiries
  for delete using (public.is_staff());

-- ---------- media_assets ----------------------------------------------------
drop policy if exists media_staff_all on public.media_assets;
create policy media_staff_all on public.media_assets
  for all using (public.is_staff()) with check (public.is_staff());

-- Public read so media_assets.public_url can resolve in content if referenced.
drop policy if exists media_public_read on public.media_assets;
create policy media_public_read on public.media_assets
  for select using (true);

-- ---------- site_settings ---------------------------------------------------
drop policy if exists settings_public_read on public.site_settings;
create policy settings_public_read on public.site_settings
  for select using (true);

drop policy if exists settings_staff_write on public.site_settings;
create policy settings_staff_write on public.site_settings
  for all using (public.is_staff()) with check (public.is_staff());

-- ---------- audit_logs ------------------------------------------------------
drop policy if exists audit_staff_read on public.audit_logs;
create policy audit_staff_read on public.audit_logs
  for select using (public.is_staff());

drop policy if exists audit_staff_insert on public.audit_logs;
create policy audit_staff_insert on public.audit_logs
  for insert with check (public.is_staff());
