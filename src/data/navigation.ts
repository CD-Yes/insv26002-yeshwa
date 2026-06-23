/** Public + admin navigation definitions. Single source of truth for menus. */

export type PublicNavKey =
  | 'home'
  | 'about'
  | 'products'
  | 'gallery'
  | 'blog'
  | 'contact';

export interface PublicNavItem {
  key: PublicNavKey;
  label: string;
  to: string;
  /** Page slug used by the `pages` live/off control. */
  pageSlug: string;
}

export const PUBLIC_NAV: PublicNavItem[] = [
  { key: 'home', label: 'Home', to: '/', pageSlug: 'home' },
  { key: 'about', label: 'About', to: '/about', pageSlug: 'about' },
  { key: 'products', label: 'Products', to: '/products', pageSlug: 'products' },
  { key: 'gallery', label: 'Gallery', to: '/gallery', pageSlug: 'gallery' },
  { key: 'blog', label: 'Blog', to: '/blog', pageSlug: 'blog' },
  { key: 'contact', label: 'Contact', to: '/contact', pageSlug: 'contact' },
];

/** Footer product links (visual parity with the original footer). */
export const FOOTER_PRODUCTS = [
  { label: 'Modular kitchens', to: '/products' },
  { label: 'Wardrobes', to: '/products' },
  { label: 'TV & storage units', to: '/products' },
  { label: 'Home office', to: '/products' },
  { label: 'Full-home interiors', to: '/products' },
];

export interface AdminNavItem {
  key: string;
  label: string;
  to: string;
  icon: string;
  group: 'Website' | 'Insights' | 'Settings';
  badgeKey?: 'newEnquiries';
}

export const ADMIN_NAV: AdminNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', to: '/admin', icon: '◧', group: 'Website' },
  { key: 'pages', label: 'Pages', to: '/admin/pages', icon: '▦', group: 'Website' },
  { key: 'blogs', label: 'Blog', to: '/admin/blogs', icon: '✎', group: 'Website' },
  { key: 'gallery', label: 'Gallery', to: '/admin/gallery', icon: '◳', group: 'Website' },
  { key: 'projects', label: 'Projects', to: '/admin/projects', icon: '▤', group: 'Website' },
  { key: 'media', label: 'Media library', to: '/admin/media', icon: '◰', group: 'Website' },
  { key: 'enquiries', label: 'Enquiries', to: '/admin/enquiries', icon: '✉', group: 'Insights', badgeKey: 'newEnquiries' },
  { key: 'health', label: 'System health', to: '/admin/system-health', icon: '◔', group: 'Insights' },
  { key: 'settings', label: 'Site settings', to: '/admin/settings', icon: '⚙', group: 'Settings' },
];
