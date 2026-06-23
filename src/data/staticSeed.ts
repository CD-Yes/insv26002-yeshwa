/**
 * Static seed content extracted from the original HTML export.
 * Used as the default/fallback dataset so the public site renders identically
 * before (or without) a Supabase connection. The same data seeds the DB
 * (see supabase/seed.sql).
 */
import type { GalleryItem, Project, BlogPost } from '@/lib/types';

const now = '2026-06-01T00:00:00.000Z';

/** Diagonal-stripe placeholder backgrounds from the original (two tones). */
export const STRIPE_A =
  'repeating-linear-gradient(135deg,#E6DAC6 0 1px,#EFE5D5 1px 15px)';
export const STRIPE_B =
  'repeating-linear-gradient(135deg,#E3D7C2 0 1px,#ECE2D1 1px 15px)';

export interface Stat {
  value: string;
  label: string;
}

export const HOME_STATS: Stat[] = [
  { value: '12+', label: 'years crafting interiors' },
  { value: '5,000+', label: 'spaces delivered' },
  { value: '30+', label: 'cities served' },
  { value: '4.9★', label: 'average client rating' },
];

export const ABOUT_STATS: Stat[] = [
  { value: '12+', label: 'years in business' },
  { value: '2,400+', label: 'homes furnished' },
  { value: '40,000 sq ft', label: 'in-house facility' },
  { value: '60+', label: 'craftspeople & designers' },
];

export const CITIES = [
  'London', 'Dubai', 'Singapore', 'Mumbai', 'New York', 'Sydney', 'Toronto',
];

export interface CategoryCard {
  title: string;
  body: string;
  tone: 'a' | 'b' | 'dark';
  large?: boolean;
}

export const HOME_CATEGORIES: CategoryCard[] = [
  { title: 'Modular kitchens', body: 'Soft-close hardware, moisture-proof carcasses and finishes built to last a lifetime of cooking.', tone: 'a', large: true },
  { title: 'Wardrobes & closets', body: 'Sliding or hinged, floor to ceiling, fully organised inside.', tone: 'b' },
  { title: 'TV & storage walls', body: 'Statement media walls with hidden cable management.', tone: 'b' },
  { title: 'Home offices', body: 'Desks and shelving built for focus, calls and calm.', tone: 'b' },
  { title: 'Full-home interiors', body: 'One studio for your entire home — kitchen to bedroom.', tone: 'dark' },
];

export interface ProcessStep {
  num: string;
  title: string;
  body: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  { num: '01', title: 'Consult & measure', body: 'A free consultation to understand your space, needs and budget.' },
  { num: '02', title: 'Design in 3D', body: 'See your space in realistic 3D before a single panel is cut.' },
  { num: '03', title: 'Manufacture', body: 'Precision-built in our own facility with checks at every stage.' },
  { num: '04', title: 'Install & handover', body: 'Clean, on-time installation — then a 5-year warranty.' },
];

export interface Review {
  name: string;
  initial: string;
  avatarColor: string;
  when: string;
  text: string;
}

export const REVIEWS: Review[] = [
  {
    name: 'Sofia Almeida', initial: 'S', avatarColor: '#D9824A', when: '2 weeks ago',
    text: '"Delivered exactly on the day promised. The finish quality is genuinely better than the big-name brands we got quotes from — and the price was fairer."',
  },
  {
    name: 'Daniel Hughes', initial: 'D', avatarColor: '#5E8B7E', when: '1 month ago',
    text: '"They handled our entire home. One point of contact, clear pricing, no last-minute add-ons. The wardrobes are stunning."',
  },
];

/** Products page filter pills + project grid. */
export const PRODUCT_FILTERS = ['All', 'Kitchens', 'Wardrobes', 'TV & storage', 'Home office', 'Full-home'];

export const SEED_PROJECTS: Project[] = [
  proj('Matte-laminate L-kitchen', 'Kitchen', 'The Lakeside Residence · London', 'a', true),
  proj('3-door sliding wardrobe', 'Wardrobe', 'The Hillside Apartment · Dubai', 'b'),
  proj('Floating media wall', 'TV & storage', 'The Garden Loft · New York', 'a'),
  proj('Study + shelving nook', 'Home office', 'The Quayside Flat · Singapore', 'b'),
  proj('Island kitchen in oak', 'Kitchen', 'The Parkview House · Sydney', 'a'),
  proj('Complete home interiors', 'Full-home', 'The Waterford Townhouse · Toronto', 'b'),
];

function proj(
  title: string,
  category: string,
  location: string,
  _tone: 'a' | 'b',
  featured = false,
): Project {
  return {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category,
    location,
    cover_image_url: null,
    cover_image_key: null,
    description: null,
    materials: null,
    is_featured: featured,
    is_published: true,
    created_at: now,
    updated_at: now,
  };
}

/** Gallery masonry — flexible heights from the original. */
export const GALLERY_ALBUMS = ['All albums', 'Kitchens', 'Wardrobes', 'Living rooms', 'Bedrooms'];

export const SEED_GALLERY: (GalleryItem & { height: number; tone: 'a' | 'b' })[] = [
  gal('Kitchen — London', 'Kitchens', 340, 'a', 0),
  gal('Wardrobe — Dubai', 'Wardrobes', 240, 'b', 1),
  gal('Living room', 'Living rooms', 300, 'a', 2),
  gal('Island kitchen', 'Kitchens', 280, 'b', 3),
  gal('Walk-in wardrobe', 'Wardrobes', 360, 'a', 4),
  gal('Media wall', 'Living rooms', 230, 'b', 5),
  gal('Bedroom storage', 'Bedrooms', 300, 'a', 6),
  gal('Study nook', 'Living rooms', 260, 'b', 7),
  gal('Full-home — Sydney', 'Kitchens', 330, 'a', 8),
];

function gal(
  title: string,
  category: string,
  height: number,
  tone: 'a' | 'b',
  sort: number,
): GalleryItem & { height: number; tone: 'a' | 'b' } {
  return {
    id: `${sort}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category,
    image_url: null,
    image_key: null,
    description: null,
    sort_order: sort,
    is_published: true,
    created_at: now,
    updated_at: now,
    height,
    tone,
  };
}

/** Blog index — featured + grid. */
export const BLOG_CATEGORIES = ['All', 'Kitchens', 'Materials', 'Storage', 'Care & maintenance'];

export const SEED_BLOG: BlogPost[] = [
  blog(
    'The modular kitchen budget guide: where to spend and where to save',
    'Kitchens',
    'A clear breakdown of what actually drives kitchen cost — carcass material, hardware, finishes and countertops — so you can build smart without overspending.',
    true,
  ),
  blog('7 layout mistakes that make a kitchen feel cramped', 'Kitchens', 'Common planning errors and how to avoid them.'),
  blog('Plywood vs MDF vs particle board: what actually lasts', 'Materials', 'A practical look at carcass materials.'),
  blog('Small-home storage: 12 ideas that reclaim space', 'Storage', 'Clever storage for compact homes.'),
  blog('How to keep laminate shutters looking new for years', 'Care & maintenance', 'Simple maintenance that pays off.'),
  blog('Sliding vs hinged wardrobes: which is right for your room', 'Wardrobes', 'Choosing the right wardrobe type.'),
  blog('Lighting your modular kitchen: a simple 3-layer approach', 'Kitchens', 'Task, ambient and accent lighting.'),
];

function blog(
  title: string,
  category: string,
  excerpt: string,
  featured = false,
): BlogPost & { featured?: boolean } {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60);
  return {
    id: slug,
    title,
    slug,
    excerpt,
    content_json: null,
    content_html: `<p>${excerpt}</p>`,
    cover_image_url: null,
    cover_image_key: null,
    author: 'Yeshwa Studio',
    status: 'published',
    published_at: now,
    seo_title: title,
    seo_description: excerpt,
    category,
    created_at: now,
    updated_at: now,
    featured,
  };
}
