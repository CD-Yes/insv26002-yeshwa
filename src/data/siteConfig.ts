/**
 * Site-wide configuration and brand constants.
 * Values here are the static defaults; at runtime the admin `site_settings`
 * table can override the contact/social/maps fields (see useSiteSettings).
 */

export const BRAND = {
  name: 'Yeshwa',
  fullName: 'Yeshwa Modular Furniture',
  tagline: 'Modular furniture studio',
  established: '2014',
} as const;

/** Brand colour tokens (mirrors styles/tokens.css for use in TS/inline styles). */
export const COLORS = {
  cream: '#F7F0E6',
  creamAdmin: '#F1EADC',
  creamPanel: '#EFE6D8',
  card: '#ffffff',
  accent: '#D9824A',
  accentHover: '#C26E38',
  accentLight: '#E5915A',
  navy: '#21353F',
  ink: '#16242B',
  slate: '#2D4654',
  muted: '#5E6E76',
  warm: '#8a7a66',
  warm2: '#9a8b76',
  onDark: '#F7F0E6',
  onDarkMuted: '#9DB0B8',
} as const;

export const FONTS = {
  serif: "'Newsreader', serif",
  sans: "'Hanken Grotesk', sans-serif",
  mono: 'ui-monospace, monospace',
} as const;

/** Default contact/business info — overridable via site_settings at runtime. */
export interface SiteSettings {
  siteUrl: string;
  email: string;
  phone: string;
  phoneRaw: string;
  whatsapp: string;
  studios: string[];
  address: string;
  hours: string;
  googleMapsEmbedUrl: string;
  googleReviewsUrl: string;
  social: {
    // linkedin: string;
    instagram: string;
    facebook: string;
  };
}

export const SITE_DEFAULTS: SiteSettings = {
  siteUrl: import.meta.env.VITE_SITE_URL ?? 'https://yeshwa.studio',
  email: 'hello@yeshwa.studio',
  phone: '+1 000 000 0000',
  phoneRaw: '+10000000000',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER ?? '10000000000',
  studios: ['Erode', 'Coimbatore'],
  address: 'Yeshwa Experience Studio · Visit by appointment',
  hours: 'Open 7 days · 10am–8pm',
  googleMapsEmbedUrl: 'https://www.google.com/maps?q=design+studio&output=embed',
  googleReviewsUrl: 'https://www.google.com/maps?q=design+studio',
  social: {
    // linkedin: '#',
    instagram: '#',
    facebook: '#',
  },
};

/** Requirement types for the enquiry form (Phase 7 spec). */
export const REQUIREMENT_TYPES = [
  'Modular Kitchen',
  'Wardrobe',
  'TV Unit',
  'Bedroom Furniture',
  'Office Furniture',
  'Storage Solution',
  'Custom Furniture',
  'Other',
] as const;

export const BUDGET_RANGES = [
  'Under $5k',
  '$5k–10k',
  '$10k–25k',
  '$25k +',
] as const;
