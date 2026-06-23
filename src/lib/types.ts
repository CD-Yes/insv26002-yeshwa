/** Shared domain types mirroring the Supabase schema (supabase/schema.sql). */

export type Role = 'admin' | 'editor';
export type PostStatus = 'draft' | 'published';
export type EnquiryStatus = 'new' | 'contacted' | 'converted' | 'closed';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
}

export interface PageRow {
  id: string;
  slug: string;
  title: string;
  is_published: boolean;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  image_url: string | null;
  image_key: string | null;
  description: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  location: string | null;
  cover_image_url: string | null;
  cover_image_key: string | null;
  description: string | null;
  materials: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_json: unknown | null;
  content_html: string | null;
  cover_image_url: string | null;
  cover_image_key: string | null;
  author: string | null;
  status: PostStatus;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  category?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  location: string | null;
  requirement_type: string | null;
  budget_range: string | null;
  message: string | null;
  source: string | null;
  status: EnquiryStatus;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  file_name: string;
  file_key: string;
  public_url: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface SiteSettingRow {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: unknown | null;
  created_at: string;
}
